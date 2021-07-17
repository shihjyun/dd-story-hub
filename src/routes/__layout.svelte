<script>
  import Footer from '$lib/layout/Footer.svelte'
  import Nav from '$lib/layout/Nav.svelte'
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->

<Nav />

<main>
  <slot />
</main>

<Footer />
