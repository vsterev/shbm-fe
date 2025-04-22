// import globals from 'globals';
// import pluginJs from '@eslint/js';
// import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
// import eslint from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
//   {languageOptions: { globals: {...globals.browser, ...globals.node} }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ];

import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		ignores: ['**/dist/*, **/build/*'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
	},
	{
		plugins: {
			react: eslintPluginReact,
			'react-refresh': reactRefresh,
			'react-hooks': fixupPluginRules(eslintPluginReactHooks),
		},

		languageOptions: {
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: { ...globals.browser, Autodesk: 'readonly' },
		},

		rules: {
			'react-refresh/only-export-components': [
				'warn',
				{
					allowConstantExport: true,
				},
			],
			'@typescript-eslint/ban-ts-comment': 'off',
			...eslintPluginReactHooks.configs.recommended.rules,
		},
	},
	globalIgnores(['dist/', 'build/', '*.js', '*.cjs', '*.mjs'])
);
