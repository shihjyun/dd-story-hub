<script>
  export let src
  export let type = 'base'
  export let alt = ''
  export let srcLeft
  export let srcRight
  export let altLeft = ''
  export let altRight = ''

  import { onMount } from 'svelte'
  import { getSideBySideImgOptimalWidth } from '$lib/article/utlis.js'

  let leftImg, rightImg
  let mounted = false
  let sideBySideWidthRatio

  onMount(() => {
    mounted = true
  })

  $: if (mounted && leftImg && rightImg) {
    // right side image will load before left side iamge
    rightImg.onload = function () {
      sideBySideWidthRatio = getSideBySideImgOptimalWidth(leftImg, rightImg)
      leftImg.parentNode.style.width = sideBySideWidthRatio.leftRatio + '%'
      rightImg.parentNode.style.width = sideBySideWidthRatio.rightRatio + '%'
    }

    // handle safari cache problem
    if (rightImg.complete) {
      sideBySideWidthRatio = getSideBySideImgOptimalWidth(leftImg, rightImg)
      leftImg.parentNode.style.width = sideBySideWidthRatio.leftRatio + '%'
      rightImg.parentNode.style.width = sideBySideWidthRatio.rightRatio + '%'
    }
  }
</script>

<style>
  figcaption > :global(a) {
    text-decoration: underline;
  }
  /* base */
  figure {
    padding-bottom: var(--space-5);
    width: 100%;
  }

  /* side-by-side */
  .side-by-side > .wrap {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .wrap > div:nth-of-type(1) {
    margin-left: auto;
  }

  /* note */
  figcaption {
    text-align: center;
    font-size: var(--font-size-0);
    padding-top: 10px;
    color: var(--grey-4);
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
    <div class="wrap">
      <div><img bind:this={leftImg} src={srcLeft} alt={altLeft} /></div>
      <div><img bind:this={rightImg} src={srcRight} alt={altRight} /></div>
    </div>
  {/if}
  <figcaption><slot /></figcaption>
</figure>
