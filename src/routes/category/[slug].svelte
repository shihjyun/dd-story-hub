<script context="module">
  export async function load({ page, fetch }) {
    // get article data
    const res = await fetch(`/article.json?category=${page.params.slug}`)

    if (res.ok) {
      return {
        props: {
          categorySlug: page.params.slug,
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
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let article, categorySlug

  $: selectedArticleAmount = article.length
  $: limitArticleAmount = $isMobile ? 4 : 9
  $: showLoadMoreButton = limitArticleAmount < selectedArticleAmount ? true : false

  function loadMore() {
    if (limitArticleAmount < selectedArticleAmount) {
      limitArticleAmount += $isMobile ? 4 : 6
    }
  }

  $: categoryName = article[0].category
</script>

<style>
  .container {
    padding: 0 var(--space-4);
    margin: 0 auto var(--space-8) 0;
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

  @media (min-width: 768px) {
    .container {
      padding: 0 0 var(--space-8) 0;
      width: 85vw;
      margin: 0 auto;
    }

    .articles {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: var(--space-5);
      row-gap: var(--space-8);
    }

    h1 {
      padding: var(--space-3) 0 var(--space-6) 0;
      margin-bottom: var(--space-8);
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
  }

  @media (min-width: 1024px) {
    .container {
      width: 75vw;
    }
  }
</style>

<svelte:head>
  <title>{categoryName} - DD Story Hub 融數基地</title>
  <link rel="canonical" href="https://www.ddstoryhub.com/category/{categorySlug}" />
  <meta
    name="description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="author" content="ddstoryhub.com" />
  <meta property="og:title" content="{categoryName} - DD Story Hub 融數基地" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.ddstoryhub.com/category/{categorySlug}" />
  <meta property="og:image" content="https://www.ddstoryhub.com/assets/index/DD-og-image.png" />
  <meta property="og:site_name" content="DD Story Hub 融數基地" />
  <meta
    property="og:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="Social" />
  <meta name="twitter:title" content="{categoryName} - DD Story Hub 融數基地" />
  <meta
    property="twitter:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="twitter:image" content="https://www.ddstoryhub.com/assets/index/DD-og-image.png" />
</svelte:head>

<div class="container">
  <h1>{categoryName}</h1>
  {#key categoryName}
    <div in:fade class="articles">
      {#each article.slice(0, limitArticleAmount) as { cover_image, slug, title, description, published_date }}
        <ArticleBlock {cover_image} {slug} {title} {description} {published_date} />
      {/each}
    </div>
  {/key}
  {#if showLoadMoreButton}
    <button on:click={loadMore}>載入更多</button>
  {/if}
</div>
