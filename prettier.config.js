export default {
    plugins: ['prettier-plugin-svelte'],
    singleQuote: true,
    semi: false,
    tabWidth: 4,
    overrides: [
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
            },
        },
    ],
}
