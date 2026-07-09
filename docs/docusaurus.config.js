// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const GITHUB_REPO = 'https://github.com/bmlt-enabled/svelte-spa-router'

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: '@bmlt-enabled/svelte-spa-router',
    tagline:
        'A router for Svelte 5 Single Page Applications — hash-based or clean History API paths',
    favicon: 'img/favicon.svg',

    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Production URL (Cloudflare Pages). Adjust if the domain changes.
    url: 'https://svelte-spa-router.bmlt.app',
    baseUrl: '/',

    organizationName: 'bmlt-enabled',
    projectName: 'svelte-spa-router',

    onBrokenLinks: 'throw',

    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'throw',
        },
    },

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                    // Docs-only mode: serve documentation at the site root.
                    routeBasePath: '/',
                    editUrl: `${GITHUB_REPO}/tree/main/docs/`,
                    showLastUpdateTime: true,
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/social-card.png',
            colorMode: {
                respectPrefersColorScheme: true,
            },
            navbar: {
                title: 'svelte-spa-router',
                logo: {
                    alt: '@bmlt-enabled/svelte-spa-router logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'docsSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        href: 'https://www.npmjs.com/package/@bmlt-enabled/svelte-spa-router',
                        label: 'npm',
                        position: 'right',
                    },
                    {
                        href: GITHUB_REPO,
                        position: 'right',
                        className: 'navbar-github-link',
                        'aria-label': 'GitHub repository',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            { label: 'Introduction', to: '/' },
                            {
                                label: 'Getting started',
                                to: '/getting-started',
                            },
                            { label: 'Routing modes', to: '/routing-modes' },
                            {
                                label: 'Advanced usage',
                                to: '/advanced/route-wrapping',
                            },
                        ],
                    },
                    {
                        title: 'Project',
                        items: [
                            { label: 'GitHub', href: GITHUB_REPO },
                            {
                                label: 'npm',
                                href: 'https://www.npmjs.com/package/@bmlt-enabled/svelte-spa-router',
                            },
                            { label: 'Issues', href: `${GITHUB_REPO}/issues` },
                            {
                                label: 'Changelog',
                                href: `${GITHUB_REPO}/blob/main/CHANGELOG.md`,
                            },
                        ],
                    },
                    {
                        title: 'BMLT',
                        items: [
                            { label: 'BMLT Enabled', href: 'https://bmlt.app' },
                            { label: 'Svelte', href: 'https://svelte.dev' },
                            {
                                label: 'Upstream (ItalyPaleAle)',
                                href: 'https://github.com/ItalyPaleAle/svelte-spa-router',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} BMLT Enabled. Forked from ItalyPaleAle/svelte-spa-router. Built with Docusaurus.`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['bash', 'nginx', 'apacheconf', 'json'],
            },
        }),
}

export default config
