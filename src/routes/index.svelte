<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('/article.json')
    const data = await res.json()
    return { props: { data } }
  }
</script>

<script>
  import ContentCarousel from '$lib/index/ContentCarousel.svelte'
  import FeatureArticles from '$lib/index/FeatureArticles.svelte'
  import NewsLetterSub from '$lib/index/NewsLetterSub.svelte'
  import CategoryArticles from '$lib/index/CategoryArticles.svelte'
  export let data
</script>

<style>
</style>

<svelte:head>
  <title>DD Story Hub</title>
  <!-- <meta property="og:url" content="https://www.dd-story-hub.com" />
  <link rel="canonical" href="https://www.dd-story-hub.com" /> -->
  <!-- <meta name="description" content="" /> -->
</svelte:head>

<section>
  <ContentCarousel content={data} />
</section>
<section>
  <FeatureArticles articles={data} />
</section>
<section>
  <NewsLetterSub />
</section>
<section>
  <CategoryArticles articles={data} />
</section>
