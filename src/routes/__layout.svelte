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
  /* your styles go here */
</style>

<!-- device detector  -->
{#if isOnMount}
  <MobileDetector />
{/if}

<!-- avoid to mount desktop UI when detecting function done -->
{#if $isMobile}
  <NavMobile isArticleNav={isInArticlePages} pageUrl={currentUrl} />
{:else}
  <Nav isArticleNav={isInArticlePages} pageUrl={currentUrl} />
{/if}

<main>
  <slot />
</main>

<Footer />
