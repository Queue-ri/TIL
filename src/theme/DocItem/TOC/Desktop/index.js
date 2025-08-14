import React from 'react';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';
export default function DocItemTOCDesktop(props) {
  const {toc, frontMatter} = useDoc();
  return (
    <TOC
      toc={props.toc} /* [DeQrypter] custom implementation */
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
      className={ThemeClassNames.docs.docTocDesktop}
    />
  );
}
