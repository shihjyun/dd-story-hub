import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		target: '#svelte'
	},

	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: sveltePreprocess({
		postcss: {
			plugins: [autoprefixer()]
		}
	})
};

export default config;
