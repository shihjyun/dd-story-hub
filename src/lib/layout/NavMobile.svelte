<script>
  import { fade, slide } from 'svelte/transition'

  let showNav = false
  let showSubNav = false

  function handleNavAction() {
    showNav = !showNav
  }

  function handleSubNavAction() {
    showSubNav = !showSubNav
  }
</script>

<style>
  nav {
    background-color: #fdfdfd;
    position: sticky;
    top: 0;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.15);
    margin-bottom: var(--space-6);
    z-index: 100000;
    user-select: none;
    height: 50px;
  }

  .nav-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
  }

  .logo {
    display: block;
    width: 100px;
  }

  .nav-icon {
    fill: var(--grey-8);
  }

  .content > .nav-icon {
    margin: var(--space-0) var(--space-0) 0 auto;
  }
  .content-bg {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--grey-5);
    opacity: 0.2;
  }
  .content {
    position: fixed;
    top: 0;
    left: 25vw;
    width: 75vw;
    height: 100vh;
    padding: var(--space-1) var(--space-4);
    background-color: white;
    opacity: 1;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    transform: translateX(75vw);
    transition: transform 0.3s ease-in-out;
  }

  .show-main-items {
    transform: translateX(0vw);
  }

  .main-items {
    margin: var(--space-4) 0 var(--space-9) var(--space-4);
  }

  .main-items > li {
    font-size: var(--font-size-2);
    color: var(--grey-8);
    margin-bottom: var(--space-6);
  }

  /* sub-items */

  .sub-items-wrap > div {
    display: flex;
    align-items: center;
    transition: all 0.1s ease-in-out;
  }

  .sub-items-wrap > div > svg {
    margin-left: var(--space-1);
  }

  .sub-items {
    height: 0;
    padding-top: 0;
    padding-left: var(--space-3);
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .sub-items > li {
    margin-bottom: var(--space-2);
  }

  .show-sub-items {
    height: 160px;
    padding-top: var(--space-5);
  }

  .highlight {
    color: var(--green-5);
    fill: var(--green-5);
  }

  /* social */
  .social {
    display: flex;
    margin: 0 0 0 var(--space-4);
  }
  .social > a {
    display: block;
    width: 32px;
    margin-right: var(--space-4);
  }
</style>

<nav>
  <div class="nav-wrap">
    <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DDSH-logo.png" alt="DD-logo" /></a>
    <svg
      on:click={handleNavAction}
      class="nav-icon"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 10H18V8H0V10ZM0 14H18V12H0V14ZM0 6H18V4H0V6ZM0 0V2H18V0H0Z" />
    </svg>
  </div>
  {#if showNav}
    <div transition:fade={{ duration: 200 }} on:click={handleNavAction} class="content-bg" />
  {/if}
  <div class:show-main-items={showNav} class="content">
    <svg
      on:click={handleNavAction}
      class="nav-icon"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
    </svg>
    <ul class="main-items">
      <li><a href="/about">關於我們</a></li>
      <li class="sub-items-wrap">
        <div class:highlight={showSubNav} on:click={handleSubNavAction}>
          分類文章<svg
            class:highlight={showSubNav}
            class="nav-icon"
            style="display: inline-block;"
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.9975 0L8.5 6.18084L15.0025 0L17 1.90283L8.5 10L0 1.90283L1.9975 0Z" />
          </svg>
        </div>
        <ul class:show-sub-items={showSubNav} class="sub-items">
          <li><a href="/about">資訊圖表</a></li>
          <li><a href="/about">資料分析</a></li>
          <li><a href="/about">數位敘事</a></li>
          <li><a href="/about">經驗分享</a></li>
        </ul>
      </li>
      <li><a href="/232323">好用工具</a></li>
      <li><a href="/abo232323ut">近期活動</a></li>
    </ul>
    <!-- social -->
    <div class="social">
      <a href="https://medium.com/dd-story-hub" target="_blank"
        ><svg
          class="nav-icon"
          viewBox="0 0 256 256"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid"
        >
          <g>
            <rect x="0" y="0" width="256" height="256" />
            <path
              d="M61.0908952,85.6165814 C61.3045665,83.5054371 60.4994954,81.4188058 58.9230865,79.9979257 L42.8652446,60.6536969 L42.8652446,57.7641026 L92.7248438,57.7641026 L131.263664,142.284737 L165.145712,57.7641026 L212.676923,57.7641026 L212.676923,60.6536969 L198.947468,73.8174045 C197.763839,74.719636 197.176698,76.2025173 197.421974,77.670197 L197.421974,174.391342 C197.176698,175.859021 197.763839,177.341902 198.947468,178.244134 L212.355766,191.407842 L212.355766,194.297436 L144.91283,194.297436 L144.91283,191.407842 L158.802864,177.923068 C160.16778,176.558537 160.16778,176.157205 160.16778,174.070276 L160.16778,95.8906948 L121.54867,193.97637 L116.329871,193.97637 L71.3679139,95.8906948 L71.3679139,161.628966 C70.9930375,164.392788 71.9109513,167.175352 73.8568795,169.174019 L91.9219516,191.086776 L91.9219516,193.97637 L40.6974359,193.97637 L40.6974359,191.086776 L58.7625081,169.174019 C60.6942682,167.172038 61.5586577,164.371016 61.0908952,161.628966 L61.0908952,85.6165814 Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </a>
      <a href="https://www.facebook.com/ddstoryhub" target="_blank"
        ><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 167.657 167.657">
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
</nav>
