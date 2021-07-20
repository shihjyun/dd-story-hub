<script context="module">
  export async function load({ page }) {
    const currentPath = page.path

    return { props: { currentPath } }
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

  export let currentPath
</script>

<style>
  /* your styles go here */
</style>

{#if isOnMount}
  <MobileDetector />
{/if}

{#if currentPath.includes('/article')}
  {#if $isMobile}
    <NavMobile />
  {:else}
    <Nav />
  {/if}
{:else if $isMobile}
  <NavMobile />
{:else}
  <Nav />
{/if}

<main>
  <slot />
</main>

<Footer />
