// https://eslint.org/docs/latest/use/configure/configuration-files

module.exports = {
    root: true,

    extends: [
        'eslint:recommended',

        // https://www.npmjs.com/package/eslint-config-airbnb-base
        'airbnb-base',

        // https://github.com/iamturns/eslint-config-airbnb-typescript
        'airbnb-typescript/base',

        // https://typescript-eslint.io/linting/configs
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        "plugin:@typescript-eslint/strict",

        // https://github.com/import-js/eslint-plugin-import
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],

    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.eslint.json'
            }
        }
    },

    env: {
        es2020: true,
        browser: true
    },

    parser: '@typescript-eslint/parser',

    parserOptions: {
        project: './tsconfig.eslint.json'
    },

    plugins: [
        'import',
        '@typescript-eslint'
    ],

    ignorePatterns: [
        './**/*.js',
        '/.eslintrc.cjs',
        '/dist',
        '/docs',
        '/node_modules'
    ],

    rules: {
        '@typescript-eslint/array-type': ['error', {default: 'generic', readonly: 'generic'}],
        '@typescript-eslint/comma-dangle': ['error', 'never'],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
        '@typescript-eslint/space-before-function-paren': ['error', {anonymous: 'always', named: 'always'}],

        'import/prefer-default-export': 'off',

        'arrow-parens': ['warn', 'as-needed'],
        'max-len': ['warn', {code: 160}],
        'no-bitwise': 'off',
        'no-console': 'off',
        'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 0, maxBOF: 0}],
        'no-plusplus': 'off',
        'no-restricted-syntax': 'off',
        'space-in-parens': 'off',
        'spaced-comment': 'off',

        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {minProperties: 6, multiline: true, consistent: true},
                ObjectPattern: {minProperties: 6, multiline: true, consistent: true},
                ImportDeclaration: {minProperties: 6, multiline: true, consistent: true},
                ExportDeclaration: {minProperties: 6, multiline: true, consistent: true}
            }
        ],
    }
};
