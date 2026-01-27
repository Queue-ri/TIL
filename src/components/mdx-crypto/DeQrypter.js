import React, { useState, useContext, useEffect, useRef } from 'react';

// for decryption
import CryptoJS from 'crypto-js';

// parser
import { MDXProvider } from '@mdx-js/react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { visit } from 'unist-util-visit';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';

import rehypeKatex from 'rehype-katex';

// docusaurus theme components
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import Heading from '@theme/Heading';
import Details from '@theme/Details';

// custom TIL components
import * as TILComponentsRaw from '@site/src/components';
// 모든 default export를 풀어서 단일 객체로 변환
const TILComponents = Object.fromEntries(
  Object.entries(TILComponentsRaw).map(([key, mod]) => [key, mod.default || mod])
);

// TOC context for DocItem
import DeQrypterContext from './DeQrypterContext';


/* custom admonition parser */
// ':::info 제목' 형식을 파싱해서 전처리
// 전처리 안하면 remark-directive에서 인식 못해서 paragraph로 파싱됨
// title 없는 ':::info' 형식은 remark-directive에서 인식함
export function remarkAdmonitionPreprocess() {
  function processNodes(nodes) {
    if (!nodes) return;

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];

      // mdxJsxFlowElement 안의 children도 재귀로 처리
      // ex. <details> 내부의 admonition
      if (node.type === 'mdxJsxFlowElement' && node.children) {
        processNodes(node.children);
      }

      if (node.type !== 'paragraph') continue;
      const firstText = node.children?.[0];
      if (!firstText || firstText.type !== 'text') continue;

      // 시작 마커 체크
      const startMatch = firstText.value.match(
        /^:::(info|tip|warning|caution|danger|note|important|success|secondary)\s*(.*)$/
      );
      if (!startMatch) continue;

      const [, type, title] = startMatch;

      // 종료 마커 찾기
      let endIndex = i + 1;
      while (endIndex < nodes.length) {
        const endNode = nodes[endIndex];
        const endText = endNode.children?.[0];
        if (
          endNode.type === 'paragraph' &&
          endText?.type === 'text' &&
          endText.value.trim() === ':::'
        ) {
          break;
        }
        endIndex++;
      }

      // contentNodes: 시작 paragraph 다음부터 종료 전 paragraph까지
      const contentNodes = nodes.slice(i + 1, endIndex);

      // containerDirective로 교체
      nodes.splice(i, endIndex - i + 1, {
        type: 'containerDirective',
        name: type,
        children: contentNodes,
        data: {
          hName: 'admonition',
          hProperties: { type, title: title || undefined },
        },
      });
    }
  }

  return (tree) => {
    processNodes(tree.children);
  };
}
// remark-admonitions는 MDX 2 부터 호환 안되므로 remark-directive로 직접 구현
// remarkAdmonition은 반드시 remarkAdmonitionPreprocess를 거친 녀석들을 처리해야 함
// ':::info' 형식의 containerDirective 노드를 admonition으로 인식하도록 처리 
function remarkAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' &&
        ['info','tip','warning','caution','danger','note','important','success','secondary'].includes(node.name)
      ) {
        node.children = node.children;
        node.data = node.data || {};
        node.data.hName = 'admonition';
        // 기존 hProperties에 title을 유지하고 type만 덮어쓰기
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          type: node.name,
        };
        // children은 이미 preprocess에서 넣었기 때문에 따로 건드릴 필요 없음
      }
    });
  };
}

/* custom code block meta parser */
// 전처리 안하면 title 등 node.meta 내의 정보가 날라감
// TODO: 여기서 정규식 파싱하기
function remarkCodeBlockMeta() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.meta) {
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          meta: node.meta
        };
      }
    });
  };
}


/* custom details parser */
// 그냥 details: ... 로 컴포넌트 매핑 시도하면 매핑이 안됨
// remark plugin은 :::details 같은 구문을 인식하기에 <details> 용으로는 부적합
// MDX AST에서 mdxJsxFlowElement 타입으로 변환된 뒤 rehype 단계에서 name을 바꾸고 MDXProvider에 매핑해야 함
function rehypeDetailsToComponent() {
  return (tree) => {
    visit(tree, (node) => {
      // mdxJsxFlowElement 타입에서 name이 'details'인 경우
      if (node.type === 'mdxJsxFlowElement' && node.name === 'details') {
        console.log('[MDX JSX Before]', node);
        node.name = 'Details';
        console.log('[MDX JSX After]', node);
      }
    });
  };
}


/* custom heading parser for TOC */
// remark plugin으로 만들어서 넣는 방식은 무한 호출되는 이슈로 인해 불가
// rehype 단에서 처리 안하면 TOC와의 id 동기화 깨져서 anchor 먹통됨
// MDX AST에서 생성한 id를 연결하지 않으면 Heading 컴포넌트가 anchor를 만들 수 없음
function rehypeExtractHeadings(setToc) {
  return (tree) => {
    const headings = [];
    visit(tree, 'element', (node) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        const text = node.children
          .filter((c) => c.type === 'text')
          .map((c) => c.value)
          .join(' ')
          .trim();

        if (!text) return;

        // id 생성: 영소문자, 공백 -> 하이픈 변환, 한/영/숫자/하이픈 허용
        const id = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^가-힣a-z0-9\-]/g, '');

        node.properties = node.properties || {};
        node.properties.id = id; // [!IMPORTANT] AST 노드에 id 부여

        headings.push({
          value: text,
          id,
          level: Number(node.tagName[1]),
        });
      }
    });
    setToc(headings);
  };
}


export default function DeQrypter({ encrypted }) {
  // DeQrypter 사용 여부
  const { setIsDeQrypterUsed, setDecryptedToc } = useContext(DeQrypterContext);

  const [decrypted, setDecrypted] = useState(null);
  const [MDXComponent, setMDXComponent] = useState(null);
  const [password, setPassword] = useState('');
  const [toc, setToc] = useState([]);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // for copy button

  // 타이머 참조를 위한 useRef
  const toastTimer = useRef(null);

  /* TOC context hook */
  useEffect(() => {
    setIsDeQrypterUsed(true); // DeQrypter 사용함
    return () => {
      setIsDeQrypterUsed(false);
      setDecryptedToc([]); // 언마운트시 TOC 초기화
    };
  }, []);

  /* MDX compilation hook */
  useEffect(() => {
    if (!decrypted) return;

    const compileMdx = async () => {
      try {
        const compiled = await evaluate(decrypted, {
          ...runtime,
          useDynamicImport: false,
          format: 'mdx',
          remarkPlugins: [remarkDirective, remarkAdmonitionPreprocess, remarkAdmonition, remarkCodeBlockMeta, remarkMath],
          rehypePlugins: [
            rehypeDetailsToComponent,
            [rehypeExtractHeadings, (headings) => {
              setToc(headings);
              setDecryptedToc(headings);
            }],
            rehypeKatex,
          ],
          useMDXComponents: () => ({
            h1: (props) => <Heading as="h1" {...props} />,
            h2: ({id, ...props}) => <Heading as="h2" id={id} {...props} />,
            h3: ({id, ...props}) => <Heading as="h3" id={id} {...props} />,
            h4: ({id, ...props}) => <Heading as="h4" id={id} {...props} />,
            h5: ({id, ...props}) => <Heading as="h5" id={id} {...props} />,
            h6: ({id, ...props}) => <Heading as="h6" id={id} {...props} />,
            Details: ({ node, ...props }) => {
              console.log('Details component rendered', props);
              let summaryText = 'Details';
              const childrenArray = Array.isArray(props.children) ? props.children : [props.children];
              const filteredChildren = childrenArray.filter((child) => {
                if (React.isValidElement(child) && child.type === 'summary') {
                  summaryText = child.props.children;
                  return false;
                }
                return true;
              });
              return <Details summary={summaryText} {...props} children={filteredChildren} />;
            },
            pre: ({node, ...props}) => {
              const child = props.children; // 중복 <pre> 제거

              // React element면 isCodeBlock 주입
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { isCodeBlock: true });
              }

              return child; // 문자열이나 다른 타입이면 그대로 반환
            },
            code: ({ isCodeBlock, meta, className, children, ...props }) => {
              if (isCodeBlock === true) {
                // code block이어도 title이나 option이 없으면 meta는 undefined
                const titleMatch = meta?.match(/title="([^"]+)"/);
                const title = titleMatch ? titleMatch[1] : undefined;

                // showLineNumbers 같은 boolean 옵션은 문자열에 키가 있으면 true
                const showLineNumbers = meta?.includes('showLineNumbers') || false;

                return <CodeBlock className={className} title={title} showLineNumbers={showLineNumbers} {...props}>{children}</CodeBlock>;
              }
              return <code className={className} {...props}>{children}</code>;
            },
            admonition: ({ node, children, ...props }) => {
              const type = node?.data?.hProperties?.type || 'info';
              return <Admonition type={type} {...props}>{children}</Admonition>;
            },
            ...TILComponents, // 커스텀 컴포넌트: MDXProvider에는 넣으면 안됨
          }),
        });

        setMDXComponent(() => compiled.default);
      } catch (error) {
        console.error('MDX compile error:', error);
        setError('MDX 컴파일 중 문제가 발생했습니다.');
      }
    };

    compileMdx();
  }, [decrypted]);

  /* Toast UI timer cleanup hook (to prevent memory leak) */
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);


  /* 복호화 함수 */
  const handleDecrypt = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, password);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) throw new Error('복호화 실패');
      console.log('[Decrypted text]');
      console.log(originalText);

      // TOC 생성
      console.log('Decrypted TOC:', toc);
      setToc(toc);
      setDecryptedToc(toc);
      
      setDecrypted(originalText);
      setError(null);
    } catch (e) {
      setError('복호화 실패: 비밀번호가 일치하지 않습니다.');
    }
  };


  /* 복호화 후 렌더링 */
  if (MDXComponent) {
    const components = {
      h1: (props) => <Heading as="h1" {...props} />,
      h2: ({id, ...props}) => <Heading as="h2" id={id} {...props} />,
      h3: ({id, ...props}) => <Heading as="h3" id={id} {...props} />,
      h4: ({id, ...props}) => <Heading as="h4" id={id} {...props} />,
      h5: ({id, ...props}) => <Heading as="h5" id={id} {...props} />,
      h6: ({id, ...props}) => <Heading as="h6" id={id} {...props} />,
      Details: ({ node, ...props }) => {
        console.log('Details component rendered', props);
        let summaryText = 'Details';
        const childrenArray = Array.isArray(props.children) ? props.children : [props.children];
        const filteredChildren = childrenArray.filter((child) => {
          if (React.isValidElement(child) && child.type === 'summary') {
            summaryText = child.props.children;
            return false;
          }
          return true;
        });
        return <Details summary={summaryText} {...props} children={filteredChildren} />;
      },
      pre: ({ node, ...props }) => {
        const child = props.children; // 중복 <pre> 제거

        // React element면 isCodeBlock 주입
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isCodeBlock: true });
        }

        return child; // 문자열이나 다른 타입이면 그대로 반환
      },
      code: ({ isCodeBlock, meta, className, children, ...props }) => {
        if (isCodeBlock === true) {
          // code block이어도 title이나 option이 없으면 meta는 undefined
          const titleMatch = meta?.match(/title="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : undefined;

          // showLineNumbers 같은 boolean 옵션은 문자열에 키가 있으면 true
          const showLineNumbers = meta?.includes('showLineNumbers') || false;

          return <CodeBlock className={className} title={title} showLineNumbers={showLineNumbers} {...props}>{children}</CodeBlock>;
        }
        return <code className={className} {...props}>{children}</code>;
      },
      admonition({node, children, ...props}) {
        const type = node?.data?.hProperties?.type || 'info';
        return <Admonition type={type} {...props}>{children}</Admonition>;
      },
    }; // end of components

    // 원문 복사 버튼 핸들러
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(decrypted);

        // 이미 실행 중인 타이머가 있다면 취소 (연타 대응)
        if (toastTimer.current) {
          clearTimeout(toastTimer.current);
        }
        
        setShowToast(true);
        toastTimer.current = setTimeout(() => {
          setShowToast(false);
          toastTimer.current = null;
        }, 2000); // 2초 후 토스트 사라짐
        //alert("원문을 클립보드에 복사했습니다.");
      
      } catch (err) {
        alert("원문을 복사하는 데 실패했습니다.");
      }
    }

    return (
      <div>
        {/* MDX post area */}
        <div style={{ marginTop: '1rem' }}>
          <MDXProvider components={components}>
            <MDXComponent />
          </MDXProvider>
        </div>

        {/* DeQrypter copy button area*/}
        <div style={{
          display: 'flex',
          marginTop: '32px',
          justifyContent: 'flex-end'
        }}
        >
          <button
            onClick={handleCopy}
            style={{
              padding: '6px 16px',
              fontFamily: 'SUIT-Regular, sans-serif',
              fontSize: '0.75rem',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            📋 원문 복사
          </button>
        </div>

        {/* Toast UI */}
        <div style={{
          position: 'fixed',
          bottom: showToast ? '20px' : '-50px', // 아래에서 위로 등장
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '0.6rem 1.6rem',
          borderRadius: '100px',
          fontFamily: 'SUIT-Regular, sans-serif',
          fontSize: '1rem',
          fontWeight: 'bold',
          zIndex: 9999,
          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: showToast ? 1 : 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✅ 원문 복사 완료! ^ㅅ^</span>
        </div>
      </div>
    );
  }


  /* 복호화 이전 패스워드 입력창 렌더링 */
  const wrapperStyle = {
    display: 'flex',
    gap: '.4rem',
    marginBottom: '.6rem',
  };

  const inputStyle = {
    flex: '1 1 auto',
    minWidth: '130px',
    maxWidth: '280px',
    border: '1px solid #ccc',
    borderRadius: '.2rem',
    fontSize: '.8rem',
    padding: '0.4rem 2.5rem 0.4rem 0.5rem',
    outline: 'none',
  };

  const buttonStyle = {
    flexShrink: 0,
    fontSize: '.8rem',
    border: '1px solid #a0a6ff',
    borderRadius: '.2rem',
    backgroundColor: 'transparent',
    padding: '0.32rem 1rem 0.32rem .9rem',
    cursor: 'pointer',
    fontFamily: 'SUIT-Regular, sans-serif',
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <p style={{ fontSize: '.9rem' }}>🔐 이 콘텐츠는 암호화되어 있습니다.</p>
      <div className="wrapper" style={wrapperStyle}>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // 폼 전송 등 기본 동작 방지
              handleDecrypt();
            }
          }}
          style={inputStyle}
        />
        <button style={buttonStyle} onClick={handleDecrypt}>🔑 해제</button>
      </div>
      {error && <div style={{ color: 'red', fontSize: '.9rem', marginTop: '.4rem'}}>{error}</div>}
    </div>
  );
}