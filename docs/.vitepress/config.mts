import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

const base = process.env.DOCS_BASE ?? '/docs/';

export default defineConfig({
  title: 'json-tool',
  description:
    'Privacy-first JSON formatter, validator and beautifier. Format, validate and inspect your JSON without sending your data anywhere.',
  lang: 'en-US',
  base,
  outDir: fileURLToPath(new URL('../../public/docs', import.meta.url)),
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#1e3a8a' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-3X215RLQFD' },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-3X215RLQFD');`,
    ],
  ],
  themeConfig: {
    logo: '/logo192.png',
    nav: [
      { text: 'User manual', link: '/guide/', activeMatch: '/guide/' },
      { text: 'About', link: '/about/why', activeMatch: '/about/' },
      { text: 'Open the app', link: 'https://marabesi.github.io/json-tool' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'User manual',
          items: [
            { text: 'Getting started', link: '/guide/' },
            { text: 'Editor (home)', link: '/guide/editor' },
            { text: 'Table view', link: '/guide/table' },
            { text: 'Shape view', link: '/guide/shape' },
            { text: 'Diff view', link: '/guide/diff' },
            { text: 'Settings', link: '/guide/settings' },
          ],
        },
      ],
      '/about/': [
        {
          text: 'About',
          items: [
            { text: 'Why json-tool?', link: '/about/why' },
            { text: 'Technology', link: '/about/technology' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/marabesi/json-tool' },
    ],
    editLink: {
      pattern: 'https://github.com/marabesi/json-tool/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the CC0 1.0 Universal license.',
      copyright: 'Copyright © 2021-present Matheus Marabesi',
    },
  },
});
