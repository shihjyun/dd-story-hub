<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('/article.json?limit=3')
    const data = await res.json()
    return { props: { data } }
  }
</script>

<script>
  import ArticleList from '$lib/shared/ArticleList.svelte'
  export let data
</script>

<style>
  .intro {
    font-size: var(--font-size-2);
    color: var(--gray-6);
    max-width: 520px;
    margin: 0 auto;
    letter-spacing: var(--letter-spacing);
    line-height: 1.75;
    padding: 0 var(--space-2) 0 var(--space-2);
  }

  @media (min-width: 576px) {
    .intro {
      line-height: var(--line-height-5);
    }
  }
</style>

<svelte:head>
  <title>DD Story Hub</title>
  <!-- <meta property="og:url" content="https://www.dd-story-hub.com" />
  <link rel="canonical" href="https://www.dd-story-hub.com" /> -->
  <!-- <meta name="description" content="" /> -->
</svelte:head>

<p class="intro">
  我們是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。
  「融數」結合數位（Digital）、數據（Data）的概念，我們希望這個計畫能夠作為同好的聚集地，除了紀錄研究與學習的過程，也將持續分享創新想法。
</p>

<ArticleList articleData={data} />
