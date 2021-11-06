import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import { Helmet } from "react-helmet";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('pre__banner__img', styles.preBannerImg)}>
        <div className={clsx('banner__img', styles.bannerImg)}></div>
      </div>
      <div className={clsx('container', styles.container)}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/date">
            📆 Date
          </Link>
          <Link
            className="button button--secondary button--lg button--hl button--mg"
            to="/featured">
            📑 Featured
          </Link>
        </div>
      </div>
      <Helmet>
        <script>
          {`
            banner = document.getElementsByClassName('banner__img')[0];
            pre_banner = document.getElementsByClassName('pre__banner__img')[0];
            
            img = new Image();
            // console.log("start loading.");
            img.src = "/static/img/banner_background_resize.jpg";
            
            img.onload = function () {
              /* replace img */
              // console.log("start replacing.");
              banner.style.backgroundImage = "url("+img.src+")";

              /* blur out */
              setTimeout(function() {
                // console.log("blur out");
                pre_banner.style.transition="1s";
                pre_banner.style.filter="blur(0)";
              },300);
            }
          `}
        </script>
      </Helmet>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
