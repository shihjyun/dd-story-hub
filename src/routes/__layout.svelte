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

  let isOnMount = false

  onMount(() => {
    isOnMount = true
  })

  // detect if user is in article pages
  export let currentUrl
  $: isInArticlePages = currentUrl.includes('/article')
</script>

<style>
  .nav-wrap {
    margin-bottom: var(--space-4);
  }

  @media (min-width: 768px) {
    .nav-wrap {
      margin-bottom: var(--space-6);
    }
  }
</style>

<!-- device detector  -->
{#if isOnMount}
  <MobileDetector />
{/if}

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
