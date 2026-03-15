import globals from 'globals'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier'

export default [
    ...svelte.configs['flat/recommended'],
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                extraFileExtensions: ['.svelte'],
            },
        },
        rules: {
            'no-var': ['error'],
            'prefer-const': ['warn'],
            'no-unused-vars': [
                'error',
                { args: 'none', caughtErrorsIgnorePattern: '^_' },
            ],
            'prefer-arrow-callback': ['warn'],
            'no-return-await': ['error'],
            'no-console': ['warn'],
            'no-nested-ternary': ['error'],
            'no-unneeded-ternary': ['warn'],
            'no-unexpected-multiline': ['error'],
            'no-multiple-empty-lines': 0,
        },
    },
]
