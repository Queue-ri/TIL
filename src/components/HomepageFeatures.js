import React, {useRef} from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.scss';
import useOnScreen from './useOnScreen.js'

const FeatureList = [
  {
    title: 'Date Order',
    Svg: require('../../static/img/1F4C5.svg').default,
    description: (
      <>
        TIL documents in date order.<br />날짜 순으로 조회할 수 있습니다.
      </>
    ),
  },
  {
    title: 'Featured Topics',
    Svg: require('../../static/img/1F4D1.svg').default,
    description: (
      <>
        TIL documents categorized by featured topics.<br />주제 별로 조회할 수 있습니다.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  // console.log(isOnScreen);
  // previous: clsx('col col--3')
  return (
    <div className={['col', clsx(styles.col), isOnScreen?styles.animated:''].join(' ').trim()} ref={ref}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
