import vercel from '@sveltejs/adapter-vercel';
import autoprefixer from 'autoprefixer';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svelte.md', '.md', '.svx'],
	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: [
		mdsvex({extensions: ['.svelte.md', '.md', '.svx']}),
		sveltePreprocess({
				postcss: {
					plugins: [autoprefixer()]
				}
		})
	],
	kit: {
		adapter: vercel(),
		target: '#svelte',
		ssr: true,
	},
};

export default config;
