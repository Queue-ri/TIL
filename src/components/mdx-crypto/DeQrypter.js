import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import ReactMarkdown from 'react-markdown';
//import remarkGfm from 'remark-gfm';
//import remarkPrism from 'remark-prism';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export default function DeQrypter({ encrypted }) {
  const [decrypted, setDecrypted] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleDecrypt = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, password);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalText || typeof originalText !== 'string') {
        throw new Error('복호화 실패');
      }

      // 마크다운 문법을 HTML로 변환하기 전에 정제 작업 수행
      const sanitizedText = originalText
        // :::info, :::tip 등 Docusaurus 마크다운을 안전한 인용문으로 대체
        .replace(/:::(info|tip|warning|caution|danger|note)[^\n]*\n([\s\S]*?)\n:::/g, (match, type, content) => {
          return `> 💡 ${type.toUpperCase()}\n>\n` +
            content
              .trim()
              .split('\n')
              .map(line => `> ${line}`)
              .join('\n');
        })
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
      setError('❌ 복호화 실패: 비밀번호가 틀렸거나 잘못된 형식입니다.');
    }
  };

  if (decrypted) {
    console.log('[복호화된 내용 (sanitized)]');
    console.log(decrypted);

    return (
      <div style={{ marginTop: '1rem' }}>
        <ReactMarkdown
          children={decrypted}
          //remarkPlugins={[remarkGfm, remarkPrism]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]} // 반드시 rehypeRaw를 먼저 놓기 (순서 중요)
        />
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <p>🔐 이 콘텐츠는 암호화되어 있습니다.</p>
      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={handleDecrypt}>🔑 해제</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}