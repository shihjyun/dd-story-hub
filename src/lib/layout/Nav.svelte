<script>
  let showHoverNav = false

  function handleClick() {
    showHoverNav = !showHoverNav
  }
</script>

<style>
  nav {
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    background-color: var(--gray-0);
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.15);
    margin-bottom: var(--space-6);
  }

  .nav-wrap {
    width: 90vw;
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    margin: 0 auto;
  }

  .logo > img {
    height: 36px;
  }

  ul {
    display: flex;
    justify-content: center;
  }

  li {
    padding: 0 var(--space-1);
    font-size: var(--font-size-1);
    color: var(--gray-5);
    transition: color 0.15s linear;
    font-weight: 400;
  }

  li:hover {
    color: var(--green-5);
  }

  .social {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  @media (min-width: 767px) {
    .nav-wrap {
      width: 75vw;
    }
    ul {
      margin-left: var(--space-6);
    }

    li {
      padding: 0 var(--space-3);
      font-size: var(--font-size-1);
      transition: color 0.15s linear;
    }

    li:nth-of-type(2) {
      cursor: pointer;
    }

    .social > span {
      font-family: Roboto;
      font-size: var(--font-size-1);
      font-weight: 500;
      color: var(--gray-6);
    }

    .social > a {
      padding-left: var(--space-2);
    }

    svg {
      width: 24px;
      fill: var(--gray-6);
      transition: fill 0.15s linear;
    }

    /* hover nav */
    .hover-nav {
      position: absolute;
      top: 50px;
      width: 100vw;
      height: 0;
      background-color: var(--grey-6);
      z-index: 2;
      transition: height 0.15s ease-in-out;
    }

    .show-hover-nav {
      height: 50px;
    }
  }

  @media (min-width: 1200px) {
  }
</style>

<nav>
  <div class="nav-wrap">
    <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DDSH-logo.png" alt="DD-logo" /></a>
    <ul>
      <li><a href="/about" sveltekit:prefetch>關於我們</a></li>
      <li on:click={handleClick}>分類文章</li>
      <li><a href="/category/1213121" sveltekit:prefetch>好用工具</a></li>
      <li><a href="/category/1312121" sveltekit:prefetch>近期活動</a></li>
    </ul>
    <div class="social">
      <span>FOLLOW US</span>
      <a href="https://medium.com/dd-story-hub" target="_blank"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1770 1000">
          <circle cx="500" cy="500" r="500" />
          <ellipse ry="475" rx="250" cy="501" cx="1296" />
          <ellipse cx="1682" cy="502" rx="88" ry="424" />
        </svg></a
      >
      <a href="https://www.facebook.com/ddstoryhub" target="_blank"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 167.657 167.657">
          <g>
            <path
              d="M83.829,0.349C37.532,0.349,0,37.881,0,84.178c0,41.523,30.222,75.911,69.848,82.57v-65.081H49.626
         v-23.42h20.222V60.978c0-20.037,12.238-30.956,30.115-30.956c8.562,0,15.92,0.638,18.056,0.919v20.944l-12.399,0.006
         c-9.72,0-11.594,4.618-11.594,11.397v14.947h23.193l-3.025,23.42H94.026v65.653c41.476-5.048,73.631-40.312,73.631-83.154
         C167.657,37.881,130.125,0.349,83.829,0.349z"
            />
          </g>
        </svg></a
      >
    </div>
  </div>
  <div class:show-hover-nav={showHoverNav} class="hover-nav" />
</nav>
