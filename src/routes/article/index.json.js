import { slugFromPath, categoryPathName } from '$lib/utils.js'

export async function get({ query }) {
	const modules = import.meta.glob('./*.{md,svx,svelte.md}');

	const articlePromises = [];
	const limit = Number(query.get('limit') ?? Infinity);
	const category = query.get('category') ?? 'all';
	const author = query.get('author') ?? 'all';


	if (Number.isNaN(limit)) {
		return {
			status: 400
		};
	}

	
	// get articles' metadata
	for (let [path, resolver] of Object.entries(modules)) {
		const slug = slugFromPath(path);
		const promise = resolver().then((article) => ({
			slug,
			...article.metadata
		}));

		articlePromises.push(promise);
	}

	const articles = await Promise.all(articlePromises);
	// filter article by limit, author, category
	const publishedArticles = articles
		.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
		.filter(d => category === 'all' | categoryPathName(d.category) === category)
		.slice(0, limit);

	// if publishedArticles is empty return error status code
	if (typeof publishedArticles !== 'undefined' && publishedArticles.length > 0) {
		return {
			body: publishedArticles
		};
	} else {
		return {
			status: 400
		};
	}


}
