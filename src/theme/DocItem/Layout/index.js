import React, { useState } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import styles from './styles.module.css';

/* [utterances] custom implementation */
import Comment from '../utterances';

/* [DeQrypter] custom implementation */
import DeQrypterContext from '@site/src/components/mdx-crypto/DeQrypterContext';

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const {frontMatter, toc: originalToc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;

  /* [DeQrypter] custom implementation */
  const { isDeQrypterUsed, decryptedToc } = React.useContext(DeQrypterContext);

  const mergedToc =
    isDeQrypterUsed
      ? [...originalToc, ...decryptedToc]
      : originalToc;

  const canRender = !hidden && mergedToc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile toc={mergedToc} /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop toc={mergedToc} />
    ) : undefined;
  return {
    hidden,
    mobile,
    desktop,
  };
}
export default function DocItemLayout({ children }) {
  /* [DeQrypter] custom implementation */
  const [isDeQrypterUsed, setIsDeQrypterUsed] = useState(false);
  const [decryptedToc, setDecryptedToc] = useState([]);

  const contextValue = { isDeQrypterUsed, setIsDeQrypterUsed, decryptedToc, setDecryptedToc };

  return (
    <DeQrypterContext.Provider value={contextValue}>
      <DocItemLayoutInner>{children}</DocItemLayoutInner>
    </DeQrypterContext.Provider>
  );
}

/* [DeQrypter] custom implementation */
// context value 변화 감지 -> useDocTOC 재호출 -> 리렌더 해야 하므로 DocItemLayoutInner로 분리함 */
function DocItemLayoutInner({ children }) {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
          {/* [utterances] custom implementation */}
          <Comment />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}