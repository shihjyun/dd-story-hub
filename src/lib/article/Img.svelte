<script>
  import { isMobile } from '$lib/utils/MobileDetector.js'

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

  $: if (mounted && leftImg && rightImg && !$isMobile) {
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
    padding-bottom: var(--space-7);
    width: 100vw;
    transform: translateX(calc(-20px));
  }

  /* side-by-side */
  .side-by-side > .wrap {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .wrap > div:nth-of-type(1) {
    margin-left: auto;
  }

  /* note */
  figcaption {
    text-align: center;
    font-size: var(--font-size-3);
    padding-top: 10px;
    color: var(--grey-5);
  }

  /* base text */
  .base-text-wrap {
    margin-top: var(--space-6);
  }
  .base-text-wrap > :global(p) {
    font-size: var(--font-size-3);
    font-weight: 400;
    color: var(--grey-7);
    line-height: var(--line-height-body);
    padding-bottom: var(--space-4);
    text-align: justify;
    padding: 0 var(--space-4);
  }

  @media (min-width: 768px) {
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

    /* side-by-side */
    .side-by-side > .wrap {
      flex-direction: row;
      gap: 10px;
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

<figure
  class:side-by-side={type === 'side-by-side'}
  class:cover={type === 'cover'}
  class:base-text={type === 'base-text'}
>
  {#if type === 'base'}
    <img {src} {alt} />
  {:else if type === 'cover'}
    <img class="cover" {src} {alt} />
  {:else if type === 'base-text'}
    <img class="base-text" {src} {alt} />
  {:else if type === 'side-by-side'}
    <div class="wrap">
      <div><img bind:this={leftImg} src={srcLeft} alt={altLeft} /></div>
      <div><img bind:this={rightImg} src={srcRight} alt={altRight} /></div>
    </div>
  {/if}
  {#if type === 'base-text'}
    <figcaption><div class="base-text-wrap"><slot /></div></figcaption>
  {:else}
    <figcaption><slot /></figcaption>
  {/if}
</figure>
