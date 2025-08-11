import React, { useState } from 'react';

// for decryption
import CryptoJS from 'crypto-js';

// parser
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// for admonitions
import remarkDirective from 'remark-directive';
import visit from 'unist-util-visit';

// docusaurus theme components
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

// custom components
// details 컴포넌트는 Details - DetailsGeneric 구조로 되어있으나 swizzle 미지원이고 복잡해서 따로 컴팩트하게 구현함
import CustomDetails from '../mdx-render/CustomDetails/CustomDetails';


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


export default function DeQrypter({ encrypted }) {
  const [decrypted, setDecrypted] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleDecrypt = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, password);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) throw new Error('복호화 실패');

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

      setDecrypted(sanitizedText);
      setError(null);
    } catch (e) {
      setError('복호화 실패: 비밀번호가 일치하지 않습니다.');
    }
  };

  if (decrypted) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <ReactMarkdown
          children={decrypted}
          remarkPlugins={[remarkDirective, remarkAdmonition]}
          rehypePlugins={[rehypeRaw]}
          components={{
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
        />
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <p style={{ fontSize: '.9rem' }}>🔐 이 콘텐츠는 암호화되어 있습니다.</p>
      <div class="wrapper" style={{ marginBottom: '.6rem' }}>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ border: '1px solid #ccc', borderRadius: '.2rem', fontSize: '.8rem', padding: '0.4rem 2.5rem 0.4rem 0.5rem', outline: 'none'}}
        />
        <button style={{ fontSize: '.8rem', border: '1px solid #a0a6ff', borderRadius: '.2rem', backgroundColor: 'transparent', marginLeft: '.4rem', padding: '0.32rem 1rem 0.32rem .9rem', cursor: 'pointer', fontFamily: 'SUIT-Regular, sans-serif' }} onClick={handleDecrypt}>🔑 해제</button>
        {error && <div style={{ color: 'red', fontSize: '.9rem', marginTop: '.4rem'}}>{error}</div>}
      </div>
    </div>
  );
}