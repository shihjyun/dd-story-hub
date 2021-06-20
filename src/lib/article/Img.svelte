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
    grid-column: 4 / 10;
    padding-bottom: 40px;
    width: 100%;
  }

  /* cover */
  figure.cover {
    grid-column: 1 / 13;
  }

  /* side-by-side */
  figure.side-by-side {
    grid-column: 2 / 12;
  }

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
    font-size: var(--text-sm);
    padding-top: 10px;
    color: var(--gray-400);
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
