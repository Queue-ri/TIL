import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function Math({ eq, inline, block }) {
  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      style={!inline ? { margin: '0 0 var(--ifm-paragraph-margin-bottom)' } : {}}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(eq, { throwOnError: false, displayMode: block }),
      }}
    />
  );
}