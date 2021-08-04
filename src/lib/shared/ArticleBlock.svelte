<script>
  import { formatDate, categoryPathName } from '$lib/utils/utils.js'

  // for normal article block
  export let category, slug, cover_image, title, description, published_date
  // for read-more article block
  export let readMoreArticleSlug

  async function getArticleMeta() {
    const res = await fetch(`/article/${readMoreArticleSlug}.json`)
    const articleMeta = await res.json()
    return articleMeta
  }
</script>

<style>
  .article > .cover {
    display: block;
    position: relative;
    width: 100%;
    padding-bottom: 52.5%;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: var(--space-2);
  }

  .cover > img {
    position: absolute;
  }

  .article > .category {
    display: inline-block;
    font-size: var(--font-size-1);
    color: var(--green-5);
    padding: var(--space-2) 0;
  }

  .article > .title {
    display: block;
    color: var(--grey-7);
    font-size: var(--font-size-6);
    font-weight: 600;
    margin-bottom: var(--space-3);
    line-height: var(--line-height-heading);
  }

  .article > .description {
    color: var(--grey-5);
    font-size: var(--font-size-3);
    text-overflow: ellipsis;
    line-height: var(--line-height-body);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
  }

  .article > .date {
    font-size: var(--font-size-1);
    color: var(--grey-5);
    padding-top: var(--space-2);
  }

  .article > .category {
    font-size: var(--font-size-1);
    color: var(--green-5);
    padding-bottom: var(--space-1);
  }

  @media (min-width: 768px) {
    .article > .title {
      font-size: var(--font-size-5);
      margin-bottom: var(--space-2);
    }
  }
</style>

<div class="article">
  {#if readMoreArticleSlug}
    {#await getArticleMeta()}
      <!-- promise is pending -->
    {:then article}
      <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(article.category)}`}
        >{article.category}</a
      >
      <a class="cover" href={`/article/${readMoreArticleSlug}`} sveltekit:prefetch
        ><img src={article.cover_image} alt="cover" /></a
      >
      <a class="title" href={`/article/${readMoreArticleSlug}`} sveltekit:prefetch>{article.title}</a>
      <div class="description">{article.description}</div>
      <div class="date">{formatDate(Date.parse(article.published_date))}</div>
    {/await}
  {:else}
    {#if category}
      <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(category)}`}>{category}</a>
    {/if}
    <a class="cover" href={`/article/${slug}`} sveltekit:prefetch><img src={cover_image} alt="cover" /></a>
    <a class="title" href={`/article/${slug}`} sveltekit:prefetch>{title}</a>
    <div class="description">{description}</div>
    <div class="date">{formatDate(Date.parse(published_date))}</div>
  {/if}
</div>
