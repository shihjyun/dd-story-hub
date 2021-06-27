<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/article.json?category=${page.params.slug}`)

    if (res.ok) {
      return {
        props: {
          data: await res.json(),
        },
      }
    }

    return {
      status: res.status,
      error: new Error(),
    }
  }
</script>

<script>
  import ArticleList from '$lib/shared/ArticleList.svelte'
  export let data
</script>

<ArticleList articleData={data} />
