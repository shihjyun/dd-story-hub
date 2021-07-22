<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/article.json?author=${page.params.slug}`)
    const resAuthor = await fetch('/assets/author/authors.json').then((d) => d.json())

    if (res.ok) {
      return {
        props: {
          data: await res.json(),
          author: await resAuthor.filter((d) => d.id === page.params.slug)[0],
        },
      }
    }

    return {
      status: res.status,
      error: new Error(),
    }
  }
</script>
