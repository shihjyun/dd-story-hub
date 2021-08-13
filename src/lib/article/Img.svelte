<script>
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let src
  export let type = 'base'
  export let alt = ''
  export let srcLeft
  export let srcRight
  export let altLeft = ''
  export let altRight = ''

  import { onMount, getContext } from 'svelte'
  import { getSideBySideImgOptimalWidth } from '$lib/article/utlis.js'
  import { suffixPath, isCached } from '$lib/utils/utils.js'

  let leftImg, rightImg, img, observer
  let mounted = false
  let sideBySideWidthRatio

  // get images' meta
  let imgMeta
  if (src) {
    // base/base-text/cover
    imgMeta = getContext('images-meta').imagesMeta.filter((d) => src.includes(d.img))
  } else {
    // side-by-side
    imgMeta = getContext('images-meta').imagesMeta.filter((d) => [srcLeft, srcRight].includes(d.img))
  }

  onMount(() => {
    mounted = true

    // implement lazy load
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => handleLazyImageIsIntersectionInArticle(entry))
      },
      { threshold: 0.2 }
    )

    setTimeout(() => {
      if (src) {
        observer.observe(img)
      } else {
        observer.observe(leftImg)
        observer.observe(rightImg)
      }
    }, 1000)
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
  } else if (mounted && leftImg && rightImg && $isMobile) {
    leftImg.parentNode.style.width = '100%'
    rightImg.parentNode.style.width = '100%'
  }

  function handleLazyImageIsIntersectionInArticle(entry) {
    if (entry.isIntersecting && src) {
      img.setAttribute('src', img.dataset.src)
      observer.disconnect()
    } else if (entry.isIntersecting && srcLeft && srcRight) {
      leftImg.setAttribute('src', leftImg.dataset.src)
      rightImg.setAttribute('src', rightImg.dataset.src)
      observer.disconnect()
    }
  }
</script>

<style>
  img {
    margin: 0 auto;
  }
  figcaption :global(a) {
    text-decoration: underline;
  }
  /* base */
  figure {
    width: 100vw;
    transform: translateX(calc(min(-20px, (530px - 100vw)/2)));
    margin-top: var(--space-5);
    padding-bottom: var(--space-7);
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
    padding-top: var(--space-2);
    color: var(--grey-5);
  }

  /* base text */
  .base-text-wrap {
    max-width: 570px;
    margin: var(--space-4) auto 0 auto;
  }
  .base-text-wrap > :global(p) {
    font-size: var(--font-size-3);
    font-weight: 400;
    color: var(--grey-7);
    line-height: var(--line-height-body);
    padding: 0 var(--space-4) var(--space-4) var(--space-4);
    text-align: left;
  }

  /* img breakpoint */
  @media (min-width: 640px) {
    figure {
      width: 640px;
      transform: translateX(calc((570px - 640px) / 2));
    }
  }

  @media (min-width: 768px) {
    figure {
      margin-top: var(--space-6);
      padding-bottom: var(--space-8);
    }

    figure.cover {
      width: 100vw;
      transform: translateX(calc((570px - 100vw) / 2));
      padding-bottom: var(--space-8);
    }

    figcaption {
      font-size: var(--font-size-3);
    }

    /* side-by-side */
    .side-by-side > .wrap {
      flex-direction: row;
      gap: 10px;
    }

    /* base text */
    figure.base-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 90vw;
      transform: translateX(calc((570px - 90vw) / 2));
    }

    .base-text-wrap > :global(p) {
      font-size: var(--font-size-4);
    }
  }

  @media (min-width: 966px) {
    figure.side-by-side {
      width: 966px;
      transform: translateX(calc((570px - 966px) / 2));
    }

    figure.base-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 966px;
      transform: translateX(calc((570px - 966px) / 2));
    }
  }
</style>

<figure
  class:base={type === 'base'}
  class:side-by-side={type === 'side-by-side'}
  class:cover={type === 'cover'}
  class:base-text={type === 'base-text'}
>
  {#if type === 'base'}
    <img bind:this={img} src={suffixPath(src, '-ph')} {alt} width={imgMeta[0].width} data-src={src} />
  {:else if type === 'cover'}
    <img bind:this={img} class="cover" src={suffixPath(src, '-ph')} {alt} width={imgMeta[0].width} data-src={src} />
  {:else if type === 'base-text'}
    <img bind:this={img} class="base-text" src={suffixPath(src, '-ph')} {alt} width={imgMeta[0].width} data-src={src} />
  {:else if type === 'side-by-side'}
    <div class="wrap">
      <div>
        <img
          bind:this={leftImg}
          src={suffixPath(srcLeft, '-ph')}
          alt={altLeft}
          width={imgMeta[0].width}
          data-src={srcLeft}
        />
      </div>
      <div>
        <img
          bind:this={rightImg}
          src={suffixPath(srcRight, '-ph')}
          alt={altRight}
          width={imgMeta[1].width}
          data-src={srcRight}
        />
      </div>
    </div>
  {/if}
  {#if type === 'base-text'}
    <figcaption><div class="base-text-wrap"><slot /></div></figcaption>
  {:else}
    <figcaption><slot /></figcaption>
  {/if}
</figure>
