<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/article.json?category=${page.params.slug}`)
    const data = await res.json()

    return { props: { data } }
  }
</script>

<script>
  import ArticleList from '$lib/shared/ArticleList.svelte'
  export let data
</script>

<style>
</style>

<ArticleList articleData={data} />
