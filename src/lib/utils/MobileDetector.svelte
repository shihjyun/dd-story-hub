<script>
  import { isMobile } from './MobileDetector.js'
  import { onMount } from 'svelte'

  export let minWidth = 768
  // media query event handler
  onMount(() => {
    if (matchMedia) {
      const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
      mq.addListener(WidthSizeChange)
      WidthSizeChange(mq)
    }
  })

  // mobile detector when window's width size change
  function WidthSizeChange(mq) {
    if (mq.matches) {
      isMobile.set(false)
    } else {
      isMobile.set(true)
    }
  }
</script>
