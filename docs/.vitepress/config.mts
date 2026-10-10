import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  title: 'json-tool',
  description:
    'Privacy-first JSON formatter, validator and beautifier. Format, validate and inspect your JSON without sending your data anywhere.',
  lang: 'en-US',
  base: '/json-tool/docs/',
  outDir: fileURLToPath(new URL('../../public/docs', import.meta.url)),
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/json-tool/docs/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e3a8a' }],
  ],
  themeConfig: {
    logo: '/logo192.png',
    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'About', link: '/about/why', activeMatch: '/about/' },
      { text: 'Open the app', link: 'https://marabesi.github.io/json-tool' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/' },
            { text: 'Editor (home)', link: '/guide/editor' },
            { text: 'Table view', link: '/guide/table' },
            { text: 'Shape view', link: '/guide/shape' },
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
