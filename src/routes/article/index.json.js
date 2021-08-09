import { slugFromPath, categoryPathName } from '$lib/utils/utils.js'

export async function get({ query }) {
	const modules = import.meta.glob(`./*.md`);

	const articlePromises = [];
	const limit = Number(query.get('limit') ?? Infinity);
	const category = query.get('category') ?? 'all';
	const author = query.get('author') ?? 'all';


	if (Number.isNaN(limit)) {
		return {
			status: 404,
			error: new Error(),
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
		.sort((a, b) => (new Date(a.published_date) < new Date(b.published_date) ? 1 : -1))
		.filter(d => category === 'all' | categoryPathName(d.category) === category)
		.filter(d => author === 'all' | d.author_id === author)
		.slice(0, limit);

	// if publishedArticles is empty return error 
	if (typeof publishedArticles !== 'undefined' && publishedArticles.length > 0) {
		return {
			body: publishedArticles
		};
	} else {
		return {
			status: 404,
			error: new Error(),
		};
	}


}
