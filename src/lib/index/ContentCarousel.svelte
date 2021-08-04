<script>
  import { fade } from 'svelte/transition'
  import { formatDate, categoryPathName } from '$lib/utils/utils.js'
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let content

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
    align-items: flex-start;
    margin: var(--space-4) auto var(--space-4) auto;
    padding: 0 0 min(115%, 450px) 0;
    user-select: none;
    width: 100%;
  }

  .btns {
    bottom: min(10%, 10px);
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    z-index: 0;
  }

  .btns > svg {
    width: 24px;
    padding: var(--space-2) 0;
    fill: var(--grey-5);
    cursor: pointer;
  }

  .btns > svg:nth-of-type(1) {
    margin-left: var(--space-2);
  }

  .btns > svg:nth-of-type(2) {
    margin-right: var(--space-2);
  }

  .content {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 570px;
    width: 100%;
    padding: 0 var(--space-4) 0 var(--space-4);
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

  .cover:after {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background-color: var(--grey-0);
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  .cover:hover:after {
    opacity: 0.4;
  }

  .content > .category {
    font-size: var(--font-size-1);
    color: var(--green-5);
    padding: var(--space-2) 0;
    cursor: pointer;
  }

  .content > .title {
    font-size: var(--font-size-6);
    color: var(--grey-7);
    font-weight: bold;
    line-height: 1.7;
    text-align: center;
  }

  .content > .date {
    font-size: var(--font-size-1);
    color: var(--grey-5);
    padding: var(--space-2) 0;
  }

  /*  progress dots */
  .dots {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0;
  }
  .dots > span {
    border-radius: 100%;
    width: 6px;
    height: 6px;
    background-color: var(--grey-2);
    margin: 0 calc(var(--space-0) / 2);
    transition: background-color 0.05s ease-in-out;
  }

  .dots > .currentProgress {
    background-color: var(--grey-7);
  }

  @media (min-width: 768px) {
    .content-carousel {
      width: 90%;
      height: 500px;
      margin: var(--space-2) auto var(--space-2) auto;
      padding: 0 var(--space-1) 0 var(--space-1);
    }

    .content {
      position: initial;
      width: 70%;
    }

    .content > .title {
      width: 100%;
      font-size: var(--font-size-7);
    }

    .btns {
      bottom: 45%;
      width: 100%;
      position: absolute;
      display: flex;
      justify-content: space-between;
    }

    .btns > svg {
      padding: var(--space-2) 0;
    }

    .btns > svg:nth-of-type(1) {
      margin-left: var(--space-8);
    }

    .btns > svg:nth-of-type(2) {
      margin-right: var(--space-8);
    }
  }

  @media (min-width: 1024px) {
    .content-carousel {
      width: 900px;
      margin: var(--space-8) auto var(--space-8) auto;
      padding: 0 var(--space-7) 0 var(--space-7);
    }
  }
</style>

<div class="content-carousel">
  {#if $isMobile}
    <!-- progress dots -->
    <div class="dots">
      {#each content as c, i}
        <span class:currentProgress={i === Math.abs(index % content.length)} />
      {/each}
    </div>
  {:else}
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
  {/if}
  <!-- content -->
  {#key currentContent}
    <div in:fade class="content">
      <a class="cover" href={`/article/${currentContent.slug}`} sveltekit:prefetch
        ><img src={currentContent.cover_image} alt="" /></a
      >
      <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(currentContent.category)}`}
        >{currentContent.category}</a
      >
      <a class="title" href={`/article/${currentContent.slug}`} sveltekit:prefetch>{currentContent.title}</a>
      <div class="date">{formatDate(Date.parse(currentContent.published_date))}</div>
    </div>
  {/key}
</div>
