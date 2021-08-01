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
  <title>DD Story Hub 融數基地</title>
  <link rel="canonical" href="https://www.ddstoryhub.com/" />
  <meta
    name="description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="author" content="ddstoryhub.com" />
  <meta property="og:title" content="DD Story Hub 融數基地" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.dd-story-hub.com" />
  <meta property="og:image" content="https://www.ddstoryhub.com/assets/index/DD-avatar-text-en.png" />
  <meta property="og:site_name" content="DD Story Hub 融數基地" />
  <meta
    property="og:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="Social" />
  <meta name="twitter:title" content="DD Story Hub 融數基地" />
  <meta
    property="twitter:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="twitter:image" content="https://www.ddstoryhub.com/assets/index/DD-avatar-text-en.png" />
</svelte:head>

<section>
  <ContentCarousel content={data.slice(0, 3)} />
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
