<script>
  import { onMount } from 'svelte'
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let heightD = 587
  export let heightM = 400

  let iframeWrap

  onMount(() => {
    iframeWrap.childNodes[0].style.height = $isMobile ? heightM + 'px' : heightD + 'px'
  })
</script>

<style>
  .iframe-wrap {
    padding: var(--space-5) 0;
  }

  .iframe-wrap :global(iframe) {
    width: 1px;
    min-width: 100%;
  }
</style>

<div bind:this={iframeWrap} class="iframe-wrap">
  <!-- real iframe -->
  <slot />
</div>
