import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$lib_components: './src/lib/components',
			$lib_utils: './src/lib/utils',
			$lib_api: './src/lib/api',
			$styles: './src/styles'
		}
	},
	preprocess: vitePreprocess()
};

export default config;
