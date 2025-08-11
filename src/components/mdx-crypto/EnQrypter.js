import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function EnQrypter() {
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [encrypted, setEncrypted] = useState('');
  const [copied, setCopied] = useState(false);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleEncrypt = () => {
    try {
      const ciphertext = CryptoJS.AES.encrypt(plaintext, password).toString();
      setEncrypted(ciphertext);
      setCopied(false);
    } catch (e) {
      setEncrypted('암호화 실패: 입력값을 확인해주세요.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encrypted);
    setCopied(true);
  };

  const inputStyle = {
    marginBottom: '0.5rem',
    width: '100%',
    padding: '0.5rem 2.5rem 0.5rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '.2rem',
    outline: 'none'
  };

  const textAreaStyle = {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem 2.5rem 0.5rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '.2rem',
  };

  const wrapperStyle = {
    position: 'relative',
    width: '100%',
  };

  const eyeButtonStyle = {
    position: 'absolute',
    right: '0.5rem',
    transform: 'translateY(20%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>🔐 EnQrypter</h3>

      <textarea
        rows={10}
        placeholder="여기에 마크다운 또는 평문을 입력하세요"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={textAreaStyle}
      />

      {/* 비밀번호 입력 */}
      <div style={wrapperStyle}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={eyeButtonStyle}
        >
          {showPassword ? '🤫' : '👀'}
        </button>
      </div>

      {/* 비밀번호 재입력 */}
      <div style={wrapperStyle}>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="비밀번호 재입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          style={eyeButtonStyle}
        >
          {showConfirmPassword ? '🤫' : '👀'}
        </button>
      </div>

      {confirmPassword && (
        <p style={{ color: passwordsMatch ? 'green' : 'red', marginTop: 0, fontSize: '.9rem'}}>
          {passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
        </p>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button style={{ marginTop: '.4rem', padding: '0.32rem 1rem 0.32rem .9rem', fontSize: '.8rem', fontFamily: 'SUIT-Regular, sans-serif', border: `1px solid ${passwordsMatch ? '#a0a6ff' : '#ccc'}`, borderRadius: '.2rem', backgroundColor: 'transparent', cursor: passwordsMatch ? 'pointer' : 'default' }} onClick={handleEncrypt} disabled={!passwordsMatch}>
          🔒 암호화
        </button>
        {encrypted && (
          <button style={{ margin: '.4rem 0 0 .5rem', padding: '0.32rem 1rem 0.32rem .9rem', fontSize: '.8rem', fontFamily: 'SUIT-Regular, sans-serif', border: '1px solid #a0a6ff', borderRadius: '.2rem', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={handleCopy}>
            {copied ? '✅ 복사됨' : '📋 복사'}
          </button>
        )}
      </div>

      {encrypted && (
        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>🔑 암호화된 문자열:</div>
          <textarea
            rows={5}
            readOnly
            value={encrypted}
            style={textAreaStyle}
          />
        </div>
      )}
    </div>
  );
}