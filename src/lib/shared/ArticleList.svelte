<script>
  export let articleData
  export let title = '我們'
</script>

<style>
  .read-more-wrap {
    position: relative;
    padding-bottom: 2.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, 240px);
    grid-auto-flow: row;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    margin: 0 auto;
    max-width: 800px;
  }

  .img-wrap {
    overflow: hidden;
  }

  .article-wrap {
    padding: 1rem 0;
  }

  .read-more-title {
    text-align: center;
    font-size: 1.125rem;
    line-height: 1.75rem;
    padding-top: 3rem;
    color: var(--gray-600);
    letter-spacing: 0.05em;
  }

  h3 {
    font-weight: 400;
    letter-spacing: 0em;
    text-align: left;
    font-size: 1rem;
    color: var(--gray-600);
    padding: 0.25rem 1rem 1rem 1rem;
  }

  h3:hover {
    color: var(--green-500);
  }

  img {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transform: translate3d(0 0 0 0 0 1 1);
    width: 100%;
    height: 135px;
    overflow: hidden;
  }

  img:hover {
    transform: scale(1.05);
  }

  @media (min-width: 650px) {
    .read-more-title {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
</style>

<h2 class="read-more-title">{title}的文章</h2>

<div class="read-more-wrap">
  {#each articleData.slice(0, 6) as { title, cover_image, slug }}
    <div class="article-wrap">
      <div class="img-wrap">
        <a href={`/article/${slug}`} sveltekit:prefetch>
          <img src={cover_image} alt="" />
        </a>
      </div>
      <a href={`/article/${slug}`} sveltekit:prefetch>
        <h3>{title}</h3>
      </a>
    </div>
  {/each}
</div>
