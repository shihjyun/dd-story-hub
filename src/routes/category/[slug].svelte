<script context="module">
  export async function load({ page, fetch }) {
    // get article data
    const res = await fetch(`/article.json?category=${page.params.slug}`)

    if (res.ok) {
      return {
        props: {
          article: await res.json(),
        },
      }
    }

    return {
      status: res.status,
      error: new Error(),
    }
  }
</script>

<script>
  import { fade } from 'svelte/transition'
  import ArticleBlock from '$lib/shared/ArticleBlock.svelte'

  export let article

  $: selectedArticleAmount = article.length
  let limitArticleAmount = 5
  $: showLoadMoreButton = limitArticleAmount < selectedArticleAmount ? true : false

  function loadMore() {
    if (limitArticleAmount < selectedArticleAmount) {
      limitArticleAmount += 4
    }
  }

  const categoryName = article[0].category
</script>

<style>
  .container {
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-8);
  }

  h1 {
    color: var(--green-6);
    font-size: var(--font-size-7);
    padding: var(--space-3) 0 var(--space-6) 0;
    border-bottom: 2px var(--grey-1) solid;
    margin-bottom: var(--space-4);
  }

  button {
    display: block;
    margin: var(--space-9) auto 0 auto;
    font-size: var(--font-size-2);
    color: var(--grey-0);
    background-color: var(--green-5);
    padding: var(--space-1) var(--space-7);
  }

  button:focus {
    outline: 0;
  }
</style>

<div class="container">
  <h1>{categoryName}</h1>
  <div in:fade class="articles">
    {#each article.slice(0, limitArticleAmount) as { cover_image, slug, title, description, published_date }}
      <ArticleBlock {cover_image} {slug} {title} {description} {published_date} />
    {/each}
  </div>
  {#if showLoadMoreButton}
    <button on:click={loadMore}>載入更多</button>
  {/if}
</div>
