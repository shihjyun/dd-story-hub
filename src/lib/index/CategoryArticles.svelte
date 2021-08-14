<script>
  import { fade } from 'svelte/transition'
  import ArticleBlock from '$lib/shared/ArticleBlock.svelte'
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let articles

  // selected setting
  let selectedCat = '全部文章'
  const catsList = [
    {
      label: '全部文章',
      value: '全部文章',
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
    if (selectedCat == '全部文章') {
      return true
    } else {
      return d.category === selectedCat
    }
  })

  // mobile category switcher
  let showSelection = false

  // load more setting
  $: limitArticleAmount = $isMobile ? 4 : 9
  $: selectedArticleAmount = selectedArticles.length
  $: showLoadMoreButton = limitArticleAmount < selectedArticleAmount ? true : false

  function handleClick() {
    selectedCat = this.dataset.value
  }

  function handleSelectCategory() {
    showSelection = !showSelection
    // reset limit article amount when category are changed
    limitArticleAmount = $isMobile ? 4 : 6
  }

  function loadMore() {
    if (limitArticleAmount < selectedArticleAmount) {
      limitArticleAmount += $isMobile ? 4 : 6
    }
  }
</script>

<style>
  .category-articles {
    position: relative;
    padding: var(--space-4) var(--space-4) var(--space-7) var(--space-4);
    border-bottom: 2px var(--grey-2) solid;
  }

  h2 {
    color: var(--grey-7);
    font-size: var(--font-size-5);
    padding: var(--space-6) 0 var(--space-6) 0;
    color: var(--grey-7);
    border-bottom: 2px var(--grey-1) solid;
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-6);
  }

  .selected {
    color: var(--grey-7) !important;
    border-bottom: 2px var(--green-2) solid;
  }

  /* category select for mobile device */

  .selected-cat {
    position: relative;
    display: flex;
    align-items: center;
    color: var(--grey-7);
    font-size: var(--font-size-3);
    font-weight: 400;
    margin: var(--space-3) 0 var(--space-6) 0;
  }

  .selected-cat > svg {
    fill: var(--grey-7);
    margin-left: var(--space-1);
  }

  .selected-cat > ul {
    position: absolute;
    z-index: 3;
    background-color: var(--grey-0);
    top: 30px;
    padding-bottom: var(--space-1);
    height: 0;
    overflow: hidden;
    transition: height 0.15s ease-in-out;
  }

  ul.cat-show {
    height: 210px;
  }

  .selected-cat > ul > li {
    font-size: var(--font-size-2);
    color: var(--grey-8);
    margin: var(--space-2) var(--space-4);
    padding-bottom: calc(var(--space-0) / 2);
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

  /* category nav */
  .category-nav > ul {
    display: flex;
    justify-content: center;
  }

  .category-nav > ul > li {
    color: var(--grey-5);
    margin: 0 var(--space-4);
    cursor: pointer;
    padding-bottom: calc(var(--space-0) / 2);
  }

  @media (min-width: 768px) {
    .category-articles {
      padding: 0 0 var(--space-8) 0;
    }

    h2 {
      font-size: var(--font-size-5);
      padding: var(--space-8) 0 var(--space-7) 0;
    }

    .articles-wrap {
      margin: 0 auto;
      width: 85vw;
    }

    .articles {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: var(--space-5);
      row-gap: var(--space-8);
    }

    /* category nav */
    .category-nav > ul {
      margin: var(--space-6) 0;
    }
  }

  @media (min-width: 1024px) {
    .articles-wrap {
      width: 75vw;
      max-width: 1200px;
    }
  }
</style>

<div class="category-articles">
  <div class="articles-wrap">
    <h2>分類文章</h2>
    {#if $isMobile}
      <div on:click={handleSelectCategory} class="selected-cat">
        {selectedCat}<svg
          style="display: inline-block;"
          width="17"
          height="10"
          viewBox="0 0 17 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1.9975 0L8.5 6.18084L15.0025 0L17 1.90283L8.5 10L0 1.90283L1.9975 0Z" />
        </svg>
        <ul class:cat-show={showSelection}>
          {#each catsList as { label, value }}
            <li class:selected={selectedCat == value} on:click={handleClick} data-value={value}>{label}</li>
          {/each}
        </ul>
      </div>
    {:else}
      <div class="category-nav">
        <ul>
          {#each catsList as { label, value }}
            <li class:selected={selectedCat == value} on:click={handleClick} data-value={value}>{label}</li>
          {/each}
        </ul>
      </div>
    {/if}
    {#key selectedArticles}
      <div in:fade class="articles">
        {#each selectedArticles.slice(0, limitArticleAmount) as { cover_image, category, slug, title, description, published_date }}
          <ArticleBlock {cover_image} {category} {slug} {title} {description} {published_date} />
        {/each}
      </div>
      {#if showLoadMoreButton}
        <button on:click={loadMore}>載入更多</button>
      {/if}
    {/key}
  </div>
</div>
