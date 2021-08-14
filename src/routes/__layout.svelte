<script context="module">
  export async function load({ page }) {
    const currentUrl = page.host + page.path

    return { props: { currentUrl } }
  }
</script>

<script>
  import Footer from '$lib/layout/Footer.svelte'
  import Nav from '$lib/layout/Nav.svelte'
  import NavMobile from '$lib/layout/NavMobile.svelte'
  // detect device's width
  import { onMount } from 'svelte'
  import MobileDetector from '$lib/utils/MobileDetector.svelte'
  import { isMobile } from '$lib/utils/MobileDetector.js'
  // utlis function
  import { handleLazyloadImageIsIntersection } from '$lib/utils/utils.js'

  // detect if user is in article pages
  export let currentUrl
  $: isInArticlePages = currentUrl.includes('/article')

  // lazy load all of the images that class contain `lazyload`
  let observer
  onMount(() => {
    setTimeout(() => {
      observeLazyloadImages()
    }, 1000)

    setInterval(
      () => {
        if (document.querySelectorAll('.lazyload')) {
          const lazyloadImgs = document.querySelectorAll('.lazyload')
          lazyloadImgs.forEach((img) => {
            if (img.getAttribute('load') === 'false') {
              observer.observe(img)
            }
          })
        }
        // reduce check times when user in article page
      },
      isInArticlePages ? 2000000 : 2000
    )
  })

  function observeLazyloadImages() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => handleLazyloadImageIsIntersection(entry, observer))
      },
      { threshold: 0.2 }
    )
  }
</script>

<style>
  .nav-wrap {
    height: 50px;
    margin-bottom: var(--space-4);
    position: sticky;
    top: 0;
    z-index: 100000;
  }

  @media (min-width: 768px) {
    .nav-wrap {
      margin-bottom: var(--space-6);
    }
  }
</style>

<!-- device detector  -->
<MobileDetector />

<!-- avoid to mount desktop UI when detecting function done -->
<div class="nav-wrap">
  {#if $isMobile && $isMobile !== 'detecting'}
    <NavMobile isArticleNav={isInArticlePages} pageUrl={currentUrl} />
  {:else if !$isMobile && $isMobile !== 'detecting'}
    <Nav isArticleNav={isInArticlePages} pageUrl={currentUrl} />
  {/if}
</div>

<main>
  <slot />
</main>

<Footer />
