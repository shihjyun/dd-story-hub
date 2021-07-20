import { slugFromPath } from '$lib/utils/utils.js'

export async function get({ params }) {
	const modules = import.meta.glob(`./*.md`);

	// match article data from modules
	let match;
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = [path, resolver];
			break;
		}
	}

	if (!match) {
		return {
			status: 404
		};
	}

	const article = await match[1]();

	return {
		body: article.metadata
	};
}
