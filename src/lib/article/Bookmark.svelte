<script>
  import { getContext, onMount } from 'svelte'

  export let url

  let bookmark

  const path = getContext('article-path').path

  const getBookmarkData = async () => {
    const res = await fetch(`/assets${path}/bookmark.json`)
    const data = await res.json()
    return data.filter((d) => d.url === url)[0]
  }

  onMount(async () => {
    bookmark = await getBookmarkData()
    console.log(bookmark)
  })
</script>

<style>
  .bookmark {
    width: 100%;
    display: flex;
    cursor: pointer;
    margin-bottom: var(--space-5);
    border: var(--grey-2) 1px solid;
    background-color: white;
  }

  .bookmark-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-3);
  }

  .title {
    color: var(--grey-8);
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
  }

  .description {
    color: var(--grey-5);
    font-size: var(--font-size-1);
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
  }

  .host-name {
    font-size: var(--font-size-0);
    color: var(--grey-5);
  }

  .bookmark-img {
    width: 130px;
    height: 130px;
    background-position: 50% 50%;
    background-size: cover;
    background-origin: border-box;
  }

  @media (min-width: 768px) {
    .bookmark-img {
      width: 150px;
      height: 150px;
    }
  }
</style>

{#if bookmark && bookmark.og_title}
  <a class="bookmark" href={bookmark.url} target="_blank">
    <div class="bookmark-info">
      <div class="title">{bookmark.og_title}</div>
      <div class="description">{bookmark.og_description}</div>
      <div class="host-name">{bookmark.host_name}</div>
    </div>
    <div class="bookmark-img-wrap">
      <div class="bookmark-img" style="background-image: url({bookmark.og_image});" />
    </div>
  </a>
{/if}
