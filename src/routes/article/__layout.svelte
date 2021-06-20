<script context="module">
  export async function load({ page, fetch }) {
    const article = await fetch(`${page.path}.json`).then((res) => res.json())
    if (!article) {
      return {
        status: 404,
        error: new Error('Article could not be found'),
      }
    }
    return {
      props: {
        article,
      },
    }
  }
</script>

<script>
  import { formatDate } from '$lib/utils.js'

  export let article
</script>

<style>
  .article-meta {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 10px;
    margin: 0 auto 30px auto;
    max-width: 1200px;
  }

  .article-meta :global(h1) {
    display: block;
    grid-column: 3 / 11;
    font-size: 36px;
    padding: 24px 30px 10px 30px;
    font-weight: 500;
    letter-spacing: 0.025em;
    color: var(--gray-700);
  }

  .article-meta > div {
    display: flex;
    grid-column: 3 / 11;
    padding: 10px 30px 10px 30px;
  }

  .article-meta > div > div {
    padding-right: 40px;
    color: var(--gray-600);
    letter-spacing: 0.025em;
  }

  article {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 10px;
    margin: 0 auto;
    max-width: 1200px;
  }

  article :global(h2) {
    display: block;
    grid-column: 4 / 10;
    font-size: 28px;
    padding: 24px 30px 36px 30px;
  }

  article > :global(p) {
    grid-column: 4 / 10;
    font-size: var(--text-base);
    color: var(--gray-700);
    letter-spacing: 0.05em;
    line-height: 1.6;
    padding: 0 30px 24px 30px;
  }

  article :global(ul) {
    grid-column: 4 / 10;
    letter-spacing: 0.05em;
    padding: 0 30px 24px 30px;
    margin-left: 24px;
    list-style-position: outside;
    list-style-type: disc;
  }

  article :global(li) {
    font-size: var(--text-base);
    color: var(--gray-700);
    letter-spacing: 0.05em;
    line-height: 1.6;
    padding: 0 10px 18px 0;
  }
</style>

<div class="article-meta">
  <h1>{article.title}</h1>
  <div>
    <div class="author">作者：{article.author}</div>
    <div class="date">發布時間：{formatDate(article.published_date)}</div>
  </div>
</div>
<article>
  <slot />
</article>
