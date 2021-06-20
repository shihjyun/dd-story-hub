import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		target: '#svelte',
		prerender: {
			force: true
		},
	},

	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: [
		mdsvex({extensions: ['.svelte.md', '.md', '.svx']}),
		sveltePreprocess({
				postcss: {
					plugins: [autoprefixer()]
				}
		})
	],

	extensions: ['.svelte', '.svelte.md', '.md', '.svx']
};

export default config;
