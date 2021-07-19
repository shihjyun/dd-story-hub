<script>
  import { timeFormat } from 'd3-time-format'

  export let articles

  const format = timeFormat('%b %-d, %Y')
</script>

<style>
  .feature-articles {
    background-color: var(--grey-1);
    padding: var(--space-8) 0;
  }

  h2 {
    color: var(--grey-7);
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-8);
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
    color: var(--grey-7);
    font-weight: bold;
    transition: color 0.1s linear;
    margin-bottom: var(--space-3);
    line-height: var(--line-height-heading);
  }

  .article > .title:hover {
    color: var(--grey-5);
  }

  .article > .description {
    color: var(--grey-5);
    font-size: var(--font-size-3);
    text-overflow: ellipsis;
    line-height: var(--line-height-body);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
  }

  .article > .date {
    font-size: var(--font-size-1);
    color: var(--grey-5);
    padding-top: var(--space-2);
  }

  @media (min-width: 768px) {
    h2 {
      font-size: var(--font-size-5);
      padding-bottom: var(--space-7);
    }

    .articles-wrap {
      width: 75vw;
      margin: 0 auto;
    }

    .articles {
      grid-template-columns: 1fr 1fr;
      column-gap: var(--space-5);
      row-gap: var(--space-8);
    }

    .article > .title {
      font-size: var(--font-size-6);
    }
  }

  @media (min-width: 1024px) {
  }
</style>

<div class="feature-articles">
  <div class="articles-wrap">
    <h2>精選文章</h2>
    <div class="articles">
      {#each articles.slice(0, 2) as { cover_image, slug, title, description, published_date }}
        <div class="article">
          <a class="cover" href={`/article/${slug}`} sveltekit:prefetch><img src={cover_image} alt="" /></a>
          <a class="title" href={`/article/${slug}`} sveltekit:prefetch>{title}</a>
          <div class="description">{description}</div>
          <div class="date">{format(Date.parse(published_date))}</div>
        </div>
      {/each}
    </div>
  </div>
</div>
