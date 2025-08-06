import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function EnQrypter() {
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    try {
      const ciphertext = CryptoJS.AES.encrypt(plaintext, password).toString();
      setEncrypted(ciphertext);
      setCopied(false);
    } catch (e) {
      setEncrypted('❌ 암호화 실패: 입력값 확인');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encrypted);
    setCopied(true);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>🔐 EnQrypter</h3>

      <textarea
        rows={10}
        placeholder="여기에 마크다운 또는 평문을 입력하세요"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleEncrypt}>🔒 암호화</button>
        {encrypted && (
          <button onClick={handleCopy} style={{ marginLeft: '1rem' }}>
            {copied ? '✅ 복사됨' : '📋 복사'}
          </button>
        )}
      </div>

      {encrypted && (
        <div>
          <p>🔑 암호화된 문자열:</p>
          <textarea
            rows={5}
            readOnly
            value={encrypted}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
      )}
    </div>
  );
}