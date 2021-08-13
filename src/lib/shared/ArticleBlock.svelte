<script>
  import { formatDate, categoryPathName, suffixPath, isCached } from '$lib/utils/utils.js'
  import { onMount } from 'svelte'

  // for normal article block
  export let category, slug, cover_image, title, description, published_date

  // detect if image is isCached
  let imgIsCache = false
  onMount(() => {
    imgIsCache = isCached(cover_image)
  })
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
    max-width: 100%;
  }

  .cover:after {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background-color: var(--grey-0);
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  .cover:hover:after {
    opacity: 0.4;
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
  {#if category}
    <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(category)}`}>{category}</a>
  {/if}
  <a class="cover" href={`/article/${slug}`} sveltekit:prefetch
    ><img
      class={imgIsCache ? '' : 'lazyload'}
      src={imgIsCache ? cover_image : suffixPath(cover_image, '-ph')}
      alt="cover"
      width="100%"
      data-src={cover_image}
      load="false"
    />
  </a>
  <a class="title" href={`/article/${slug}`} sveltekit:prefetch>{title}</a>
  <div class="description">{description}</div>
  <div class="date">{formatDate(Date.parse(published_date))}</div>
</div>
