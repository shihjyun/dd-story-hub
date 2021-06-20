import { slugFromPath } from '$lib/utils.js'

export async function get({ query }) {
	const modules = import.meta.glob('./*.{md,svx,svelte.md}');

	const articlePromises = [];
	const limit = Number(query.get('limit') ?? Infinity);

	if (Number.isNaN(limit)) {
		return {
			status: 400
		};
	}

	for (let [path, resolver] of Object.entries(modules)) {
		const slug = slugFromPath(path);
		const promise = resolver().then((article) => ({
			slug,
			...article.metadata
		}));

		articlePromises.push(promise);
	}

	const articles = await Promise.all(articlePromises);
	const publishedArticles = articles.filter((article) => article.published_date).slice(0, limit);


	publishedArticles.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return {
		body: publishedArticles.slice(0, limit)
	};
}
