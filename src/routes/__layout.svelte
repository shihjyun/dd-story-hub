<script>
  import Footer from '$lib/layout/Footer.svelte'
  import Header from '$lib/layout/Header.svelte'
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->

<Header />

<main>
  <slot />
</main>

<Footer />
