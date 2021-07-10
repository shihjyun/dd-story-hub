import vercel from '@sveltejs/adapter-vercel';
import autoprefixer from 'autoprefixer';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		target: '#svelte'
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
