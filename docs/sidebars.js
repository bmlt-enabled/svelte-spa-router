// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'index',
    'getting-started',
    'routing-modes',
    'navigation',
    'route-parameters',
    'querystring',
    'active-links',
    'regular-expression-routes',
    'code-splitting',
    'path-routing',
    {
      type: 'category',
      label: 'Advanced usage',
      link: {type: 'doc', id: 'advanced/index'},
      items: [
        'advanced/route-wrapping',
        'advanced/route-events',
        'advanced/route-transitions',
        'advanced/nested-routers',
        'advanced/route-groups',
        'advanced/restore-scroll-position',
      ],
    },
    'upgrading',
  ],
};

export default sidebars;
