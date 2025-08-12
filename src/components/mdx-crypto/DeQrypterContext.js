import React from 'react';

const DeQrypterContext = React.createContext({
  isDeQrypterUsed: false, // DeQrypter 사용 여부
  setIsDeQrypterUsed: () => {},

  decryptedToc: [], // DeQrypter에서 복호화된 TOC 데이터
  setDecryptedToc: () => {},
});

export default DeQrypterContext;