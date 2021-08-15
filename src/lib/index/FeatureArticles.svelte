<script>
  import ArticleBlock from '$lib/shared/ArticleBlock.svelte'

  export let articles
</script>

<style>
  .feature-articles {
    background-color: var(--grey-1);
    padding: var(--space-8) var(--space-4);
  }

  h2 {
    font-size: var(--font-size-5);
    padding-bottom: var(--space-6);
    color: var(--grey-7);
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-8);
  }

  @media (min-width: 768px) {
    h2 {
      font-size: var(--font-size-5);
      padding-bottom: var(--space-7);
    }

    .articles-wrap {
      width: 85vw;
      margin: 0 auto;
    }

    .articles {
      grid-template-columns: 1fr 1fr;
      column-gap: var(--space-5);
      row-gap: var(--space-8);
    }
  }

  @media (min-width: 1024px) {
    .articles-wrap {
      width: 75vw;
      max-width: 1200px;
    }
  }
</style>

<div class="feature-articles">
  <div class="articles-wrap">
    <h2>精選文章</h2>
    <div class="articles">
      {#each articles.filter((d) =>
        ['2021-0527', '2020-0915'].includes(d.slug)
      ) as { cover_image, slug, title, description, published_date }}
        <ArticleBlock {cover_image} {slug} {title} {description} {published_date} />
      {/each}
    </div>
  </div>
</div>
