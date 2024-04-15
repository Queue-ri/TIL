// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
// const darkCodeTheme = require('prism-react-renderer/themes/palenight');
const lightCodeTheme = require('./prism-custom/one-light/oneLight.js');
// const lightCodeTheme = require('prism-react-renderer/themes/okaidia');
const darkCodeTheme = require('./prism-custom/one-dark-pro-flat/oneDarkProFlat.js');
const docNavItems = [
  {
    to: 'featured/pl/java/java-introduction',
    label: 'PL',
  },
  {
    to: 'featured/backend/spring/spring_main',
    label: 'Backend',
  },
  {
    to: 'featured/devops/jenkins/setting-jenkins-server-with-oracle-cloud',
    label: 'DevOps',
  },
  {
    to: 'featured/infra/setting-redirection-in-apache-server-with-oracle-cloud',
    label: 'Infra',
  },
  {
    to: 'featured/git/github-action/aoji-for-integration-dev-note',
    label: 'Git',
  },
  {
    to: 'featured/english/dev-vocab/a',
    label: 'English',
  },
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Queue-ri\'s TIL',
  tagline: 'Today I Learned',
  url: 'https://til.qriosity.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon/favicon.ico',
  organizationName: 'Queue-ri\'s TIL', // Usually your GitHub org/user name.
  projectName: 'TIL', // Usually your repo name.
  trailingSlash: false,

  i18n: {
    defaultLocale: 'ko',
    locales: ['en', 'ko'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ko: {
        label: '한국어',
        direction: 'ltr',
      }
    },
  },
  
  presets: [
    [
      '@docusaurus/preset-classic',
      /* @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'featured',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/Queue-ri/til/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/Queue-ri/til/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/icon/logo_161.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/static/manifest.json', // PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#8088ff',
          },
        ],
      },
    ],
    [ /* Temporary path for date markdowns */
      '@docusaurus/plugin-content-docs',
      {
        id: 'date-tmp',
        path: './md/date',
        routeBasePath: 'date-tmp',
        sidebarPath: require.resolve('./sidebars-custom.js'),
        editUrl: 'https://github.com/Queue-ri/til/edit/main/',
      },
    ],
    [ /* dev-note path & sidebar configurations */
      '@docusaurus/plugin-content-docs',
      {
        id: 'dev-note',
        path: './dev-note',
        routeBasePath: 'dev-note',
        sidebarPath: require.resolve('./sidebars-custom.js'),
        editUrl: 'https://github.com/Queue-ri/til/edit/main/',
      },
    ],
  ],

  themeConfig:
    /* @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'announcement',
        content: `🚧 Some pages are still under construction! 🚧`
      },
      navbar: {
        title: 'Queue-ri\'s TIL',
        logo: {
          alt: 'Queue-Logo',
          src: 'img/logo.svg',
        },
        items: [
          {to: '/about', label: 'About', position: 'left'},
          {to: '/date', label: 'Date', position: 'left'},
          /* {
            type: 'doc',
            docId: 'main',
            label: 'Featured',
            position: 'left'
          }, */
          {to: '/featured', label: 'Featured', position: 'left', items: docNavItems},
          {to: '/dev-note/algorio-dev-note', label: 'Dev Note', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'http://qriositylog.com',
            position: 'right',
            className: 'blog-link',
            label: 'Blog',
            'aria-label': 'Go to qriositylog.com',
          },
          {
            href: 'https://github.com/Queue-ri',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          
        ],
        hideOnScroll: true
      },
      hideableSidebar: true,
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'About',
                to: '/about',
              },
            ],
          },
          {
            title: 'Shortcuts',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com',
              },
              {
                label: 'Cloudflare Pages',
                href: 'https://developers.cloudflare.com/pages',
              },
              {
                label: 'Bejamas',
                href: 'https://bejamas.io',
              },
            ],
          },
          {
            title: 'Queue.ri',
            items: [
              {
                label: 'Blog',
                href: 'http://qriositylog.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Queue-ri',
              },
            ],
          },
          {
            title: 'Powered by',
            items: [
              {
                html: `
                  <img src="https://til.qriosity.dev/img/cloudflare_pages.svg" alt="Deploys by Cloudflare Pages" width="150px" />
                `,
              },
              {
                html: `
                  <img src="https://til.qriosity.dev/img/facebook_oss.png" alt="Built with Docusaurus" width="150px" style="margin-left:10px;" />
                `,
              },
            ],
          },
        ],
        logo: {
          alt: 'Queue-ri',
          src: './img/logo.svg',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Queue-ri, All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash','java','apacheconf'],
      },
      algolia: {
        apiKey: 'b7a1e2c35a7eec2662ce86440fa45a14',
        indexName: 'til',
        appId: 'NZLP2AD5K1',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
