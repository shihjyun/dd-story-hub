<script>
  export let src
  export let type = 'base'
  export let alt = ''
  export let note
  export let srcLeft
  export let srcRight
  export let altLeft = ''
  export let altRight = ''
</script>

<style>
  /* base */
  figure {
    padding-bottom: var(--space-5);
    width: 100%;
  }

  /* side-by-side */
  .side-by-side > .wrap {
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
  }

  .wrap > img {
    max-height: 400px;
  }

  .wrap > img:nth-of-type(1) {
    margin-left: auto;
  }

  /* note */
  figcaption {
    text-align: center;
    font-size: var(--font-size-0);
    padding-top: 10px;
    color: var(--gray-4);
  }

  @media (min-width: 576px) {
    figure {
      padding-bottom: var(--space-6);
    }

    figure.cover {
      width: 100vw;
      transform: translateX(calc((576px - 100vw) / 2));
      padding-bottom: var(--space-8);
    }

    figcaption {
      font-size: var(--font-size-1);
    }
  }

  /* img breakpoint */
  @media (min-width: 640px) {
    figure {
      width: 640px;
      transform: translateX(calc((576px - 640px) / 2));
    }
  }

  @media (min-width: 800px) {
    figure.side-by-side {
      width: 800px;
      transform: translateX(calc((576px - 800px) / 2));
    }
  }
</style>

<figure class:side-by-side={type === 'side-by-side'} class:cover={type === 'cover'}>
  {#if type === 'base'}
    <img {src} {alt} />
  {:else if type === 'cover'}
    <img class="cover" {src} {alt} />
  {:else if type === 'side-by-side'}
    <div class="wrap"><img src={srcLeft} alt={altLeft} /><img src={srcRight} alt={altRight} /></div>
  {/if}
  {#if note}
    <figcaption>{note}</figcaption>
  {/if}
</figure>
