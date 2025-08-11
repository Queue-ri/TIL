import React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function CustomDetails({ children, ...props }) {
  const childrenArray = React.Children.toArray(children);
  const summaryChild = childrenArray.find(child => child.type === 'summary');
  const contentChildren = childrenArray.filter(child => child.type !== 'summary');
  const InfimaClasses = 'alert alert--info';

  return (
    <details className={clsx(InfimaClasses, styles.details)} {...props}>
      {summaryChild ? (
        React.cloneElement(summaryChild, { className: styles.summary })
      ) : (
        <summary className={styles.summary}>더보기</summary>
      )}
      <div className={styles.collapsibleContent}>
        {contentChildren}
      </div>
    </details>
  );
}
