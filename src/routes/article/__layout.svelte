<script context="module">
  export async function load({ page, fetch }) {
    const article = await fetch(`${page.path}.json`).then((res) => res.json())

    if (!article) {
      return {
        status: 400,
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
    margin: 0 auto var(--space-6) auto;
    max-width: 576px;
    padding: 0 var(--space-2);
  }

  .article-meta :global(h1) {
    display: block;
    font-size: var(--font-size-4);
    padding: var(--space-2) 0;
    font-weight: 500;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--gray-7);
  }

  .article-meta > div {
    display: flex;
  }

  .article-meta > div > div {
    padding-right: var(--space-5);
    color: var(--gray-5);
    letter-spacing: var(--letter-spacing-wide);
    font-size: var(--font-size-1);
  }

  article {
    width: 100%;
    margin: 0 auto;
    max-width: 576px;
    padding: 0 var(--space-2);
  }

  article :global(h2) {
    display: block;
    font-size: var(--font-size-4);
    padding: var(--space-5) 0 var(--space-2) 0;
  }

  article > :global(p) {
    font-size: var(--font-size-2);
    color: var(--gray-6);
    line-height: var(--line-height-4);
    letter-spacing: var(--letter-spacing-wide);
    padding-bottom: var(--space-5);
  }

  article :global(ul) {
    letter-spacing: var(--letter-spacing-wide);
    margin-left: var(--space-5);
    list-style-position: outside;
    list-style-type: disc;
  }

  article :global(li) {
    font-size: var(--font-size-2);
    color: var(--gray-6);
    line-height: var(--line-height-3);
    letter-spacing: var(--letter-spacing-wide);
    padding-bottom: var(--space-4);
  }

  article :global(li:last-of-type) {
    padding-bottom: var(--space-5);
  }

  @media (min-width: 576px) {
    .article-meta {
      padding: 0;
    }

    .article-meta :global(h1) {
      font-size: var(--font-size-6);
      padding: var(--space-3) 0;
    }

    .article-meta > div {
      display: flex;
    }

    .article-meta > div > div {
      padding-right: var(--space-7);
      font-size: var(--font-size-2);
    }

    article {
      padding: 0 0;
    }

    article :global(h2) {
      display: block;
      font-size: var(--font-size-5);
      padding: var(--space-5) 0 var(--space-3) 0;
    }

    article > :global(p) {
      font-size: var(--font-size-3);
      line-height: var(--line-height-5);
      padding-bottom: var(--space-6);
    }

    article :global(li) {
      font-size: var(--font-size-3);
      line-height: var(--line-height-4);
      padding-bottom: var(--space-5);
    }

    article :global(li:last-of-type) {
      padding-bottom: var(--space-6);
    }
  }

  @media (min-width: 992px) {
  }
</style>

<div class="article-meta">
  <h1>{article.title}</h1>
  <div>
    <div class="author">作者：<a sveltekit:prefetch href={`../author/${article.author_id}`}>{article.author}</a></div>
    <div class="date">發布時間：{formatDate(article.published_date)}</div>
  </div>
</div>
<article>
  <slot />
</article>
