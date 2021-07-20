<script>
  import { fade } from 'svelte/transition'
  import { categoryPathName } from '$lib/utils/utils.js'
  import { timeFormat } from 'd3-time-format'

  export let articles

  const format = timeFormat('%b %-d, %Y')

  // selected setting
  let selectedCat = 'all'
  const catsList = [
    {
      label: '全部文章',
      value: 'all',
    },
    {
      label: '資訊圖表',
      value: '資訊圖表',
    },
    {
      label: '資料分析',
      value: '資料分析',
    },
    {
      label: '數位敘事',
      value: '數位敘事',
    },
    {
      label: '經驗分享',
      value: '經驗分享',
    },
  ]

  $: selectedArticles = articles.filter((d) => {
    if (selectedCat == 'all') {
      return true
    } else {
      return d.category === selectedCat
    }
  })

  function handleClick() {
    selectedCat = this.dataset.value
  }
</script>

<style>
  .category-articles {
    position: relative;
    padding-bottom: var(--space-8);
    border-bottom: 2px var(--grey-2) solid;
  }

  h2 {
    color: var(--grey-7);
    border-bottom: 1px var(--grey-1) solid;
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-6);
  }

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
    font-size: var(--font-size-1);
    color: var(--green-5);
    padding: var(--space-2) 0;
  }

  .article > .title {
    display: block;
    color: var(--grey-6);
    font-weight: bold;
    transition: color 0.1s linear;
    margin-bottom: var(--space-2);
    line-height: var(--line-height-heading);
  }

  .article > .title:hover {
    color: var(--grey-5);
  }

  .article > .description {
    color: var(--grey-5);
    font-size: var(--font-size-1);
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

  /* category nav */
  .category-nav > ul {
    display: flex;
    justify-content: center;
  }

  ul > li {
    color: var(--grey-5);
    margin: 0 var(--space-4);
    cursor: pointer;
    padding-bottom: calc(var(--space-0) / 2);
  }

  .selected {
    color: var(--grey-7);
    border-bottom: 2px var(--green-2) solid;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: var(--font-size-5);
      padding-top: var(--space-8);
      padding-bottom: var(--space-7);
    }

    .articles-wrap {
      width: 85vw;
      margin: 0 auto;
    }

    .articles {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: var(--space-5);
      row-gap: var(--space-8);
    }

    .article > .title {
      font-size: var(--font-size-5);
    }

    /* category nav */
    .category-nav > ul {
      margin: var(--space-6) 0;
    }
  }

  @media (min-width: 1024px) {
    .articles-wrap {
      width: 75vw;
      max-width: 1440px;
    }
  }
</style>

<div class="category-articles">
  <div class="articles-wrap">
    <h2>分類文章</h2>
    <div class="category-nav">
      <ul>
        {#each catsList as { label, value }}
          <li class:selected={selectedCat == value} on:click={handleClick} data-value={value}>{label}</li>
        {/each}
      </ul>
    </div>
    {#key selectedArticles}
      <div in:fade class="articles">
        {#each selectedArticles as { cover_image, category, slug, title, description, published_date }}
          <div class="article">
            <div class="category">{category}</div>
            <a class="cover" href={`/article/${slug}`} sveltekit:prefetch><img src={cover_image} alt="" /></a>
            <a class="title" href={`/article/${slug}`} sveltekit:prefetch>{title}</a>
            <div class="description">{description}</div>
            <div class="date">{format(Date.parse(published_date))}</div>
          </div>
        {/each}
      </div>
    {/key}
  </div>
</div>
