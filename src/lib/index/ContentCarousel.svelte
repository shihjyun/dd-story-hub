<script>
  import { fade } from 'svelte/transition'
  import { timeFormat } from 'd3-time-format'

  export let content

  const format = timeFormat('%b %-d, %Y')
  let index = 0

  $: currentContent = content[Math.abs(index % content.length)]

  function handleClickArrow() {
    // reset timer
    clearInterval(timer)
    timer = setInterval(() => {
      index += 1
    }, 4000)
    // get user direction
    const direction = this.dataset.direction
    if (direction === 'right') {
      index += 1
    } else {
      index -= 1
    }
  }

  // change carousel content regularly
  let timer = setInterval(() => {
    index += 1
  }, 4000)
</script>

<style>
  .content-carousel {
    position: relative;
    display: flex;
    justify-content: center;
    margin: var(--space-8) auto var(--space-8) auto;
    padding: 0 var(--space-7) 0 var(--space-7);
    user-select: none;
  }

  .btns {
    bottom: 45%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: space-between;
  }

  .btns > svg {
    width: 24px;
    padding: var(--space-2) 0;
    fill: var(--grey-5);
    cursor: pointer;
  }

  .btns > svg:nth-of-type(1) {
    margin-left: var(--space-7);
  }

  .btns > svg:nth-of-type(2) {
    margin-right: var(--space-7);
  }

  .btns > svg:hover {
    fill: var(--grey-3);
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 570px;
  }

  .content > .cover {
    position: relative;
    width: 100%;
    padding-bottom: 52.5%;
    overflow: hidden;
    cursor: pointer;
  }

  .cover > img {
    position: absolute;
  }

  .content > .category {
    font-size: var(--font-size-1);
    color: var(--green-5);
    padding: var(--space-2) 0;
  }

  .content > .title {
    color: var(--grey-7);
    font-weight: bold;
    text-align: center;
    transition: color 0.1s linear;
  }

  .content > .title:hover {
    color: var(--grey-5);
  }

  .content > .date {
    font-size: var(--font-size-1);
    color: var(--grey-5);
    padding: var(--space-2) 0;
  }

  @media (min-width: 768px) {
    .content-carousel {
      width: 80%;
      height: 437px;
    }

    .content {
      width: 70%;
    }

    .content > .title {
      font-size: var(--font-size-7);
    }
  }

  @media (min-width: 1024px) {
    .content-carousel {
      width: 65%;
    }
  }
</style>

<div class="content-carousel">
  <!-- btns -->
  <div class="btns">
    <svg
      on:click={handleClickArrow}
      data-direction="left"
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20 20"
      x="0px"
      y="0px"><g><path d="M13.5 14.5L9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z" /></g></svg
    >
    <svg
      on:click={handleClickArrow}
      data-direction="right"
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20 20"
      x="0px"
      y="0px"><g><path d="M6.5 5.5L11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z" /></g></svg
    >
  </div>
  <!-- content -->
  {#key currentContent}
    <div in:fade class="content">
      <a class="cover" href={`/article/${currentContent.slug}`} sveltekit:prefetch
        ><img src={currentContent.cover_image} alt="" /></a
      >
      <div class="category">{currentContent.category}</div>
      <a class="title" href={`/article/${currentContent.slug}`} sveltekit:prefetch>{currentContent.title}</a>
      <div class="date">{format(Date.parse(currentContent.published_date))}</div>
    </div>
  {/key}
</div>
