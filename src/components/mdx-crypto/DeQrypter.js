import React, { useState, useContext, useEffect } from 'react';

// for decryption
import CryptoJS from 'crypto-js';

// parser
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// for admonitions
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';

// docusaurus theme components
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import Heading from '@theme/Heading';

// custom components
// details 컴포넌트는 Details - DetailsGeneric 구조로 되어있으나 swizzle 미지원이고 복잡해서 따로 컴팩트하게 구현함
import CustomDetails from '../mdx-render/CustomDetails/CustomDetails';
import DeQrypterContext from './DeQrypterContext'; // TOC context for DocItem


/* custom admonition parser */
// :::info 등의 마크다운 구문을 html로 변환
// ReactMarkdown 버전 이슈로 인해 remark-admonitions 대신 remark-directive로 직접 구현
function remarkAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && ['info','tip','warning','caution','danger','note'].includes(node.name)) {
        node.type = 'admonition';
        node.data = node.data || {};
        node.data.hName = 'admonition';
        node.data.hProperties = { type: node.name };
      }
    });
  };
}

/* custom heading parser for TOC */
// remark plugin으로 만들어서 넣는 방식은 무한 호출되는 이슈로 인해 불가
function extractHeadingsFromMarkdown(mdText) {
  const lines = mdText.split('\n');
  const headings = [];
  let isFirstLevel1 = true;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      if (level === 1 && isFirstLevel1) {
        isFirstLevel1 = false;
        continue; // 첫번째 h1 무시
      }
      isFirstLevel1 = false;

      // id 생성: 영소문자, 공백 -> 하이픈 변환, 한/영/숫자/하이픈 허용
      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^가-힣a-z0-9\-]/g, '');

      headings.push({ value: text, id, level });
    }
  }

  return headings;
}


export default function DeQrypter({ encrypted }) {
  // DeQrypter 사용 여부
  const { setIsDeQrypterUsed, setDecryptedToc } = useContext(DeQrypterContext);

  const [decrypted, setDecrypted] = useState(null);
  const [password, setPassword] = useState('');
  const [toc, setToc] = useState([]);
  const [error, setError] = useState(null);

  // TOC 데이터 인덱스용 ref
  const headingIndexRef = React.useRef(0);
  // 첫번째 h1 여부 체크용 ref
  const firstH1Ref = React.useRef(true);

  useEffect(() => {
    setIsDeQrypterUsed(true); // DeQrypter 사용함
    return () => {
      setIsDeQrypterUsed(false);
      setDecryptedToc([]); // 언마운트시 TOC 초기화
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

      const sanitizedText = originalText
        // JSX style -> HTML style로 변환
        .replace(/<span\s+style=\{\s*\{([^}]+)\}\s*\}>/g, (_, styleContent) => {
          // styleContent: "fontSize:'32px', color:'red'" 등
          const htmlStyle = styleContent
            .split(',')
            .map(pair => {
              const [key, value] = pair.split(':').map(s => s.trim().replace(/^'|'$/g, ''));
              // camelCase -> kebab-case
              const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
              return `${kebabKey}:${value}`;
            })
            .join('; ');
          return `<span style="${htmlStyle}">`;
        });

      // TOC 생성
      const toc = extractHeadingsFromMarkdown(sanitizedText);
      console.log('Decrypted TOC:', toc);
      setToc(toc);
      setDecryptedToc(toc);
      
      setDecrypted(sanitizedText);
      setError(null);
    } catch (e) {
      setError('복호화 실패: 비밀번호가 일치하지 않습니다.');
    }
  };


  /* 복호화 후 렌더링 */
  if (decrypted) {
    // TOC 데이터에서 첫번째 h1은 일부러 제거되고 나머지부터 있음
    // 따라서 첫번째 h1은 id 없이 렌더링하고, 이후부터는 TOC 데이터 기반으로 id 설정

    /*
      ex1)
        h1 <- id 없음
        h2
        h2

      ex2)
        h2
        h1 <- id 있음
        h2
    */

    // init refs: useRef hook은 최상위 레벨에 있어야 함
    headingIndexRef.current = 0;
    firstH1Ref.current = true;

    // docusaurus Heading 컴포넌트로 변환
    function createHeading(level) {
      return ({ node, ...props }) => {
        if (level === 1 && firstH1Ref.current) { // 첫번째 h1: id 없이 렌더링
          firstH1Ref.current = false;
          return <Heading as="h1" {...props} />;
        }
        else { // h2~h6 or 첫번째가 아닌 h1: id 설정
          firstH1Ref.current = false;
          const index = headingIndexRef.current;
          const headingId = toc[index]?.id || '';
          headingIndexRef.current += 1;
          return <Heading as={`h${level}`} id={headingId} {...props} />;
        }
      };
    }

    return (
      <div style={{ marginTop: '1rem' }}>
        <ReactMarkdown
          remarkPlugins={[remarkDirective, remarkAdmonition, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            h1: createHeading(1),
            h2: createHeading(2),
            h3: createHeading(3),
            h4: createHeading(4),
            h5: createHeading(5),
            h6: createHeading(6),
            pre: ({node, ...props}) => <>{props.children}</>, // 중복 <pre> 제거
            code({node, inline, className, children, ...props}) {
              if (inline) {
                return <code className={className} {...props}>{children}</code>;
              }
              return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
            },
            admonition({node, children, ...props}) {
              const type = node.data?.hProperties?.type || 'info';
              return <Admonition type={type} {...props}>{children}</Admonition>;
            },
            details: ({ node, ...props }) => <CustomDetails {...props} />,
          }}
        >
          {decrypted}
        </ReactMarkdown>
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