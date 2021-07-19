<script>
  let showHoverNav = false

  function handleClick() {
    showHoverNav = !showHoverNav
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
  }

  .nav-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
  }

  .nav-main-items {
    width: 75vw;
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    margin: 0 auto;
  }

  .logo > img {
    height: 36px;
  }

  .nav-main-items > ul {
    display: flex;
    justify-content: center;
    margin-left: var(--space-6);
  }

  li {
    font-size: var(--font-size-1);
    color: var(--grey-8);
    font-weight: 400;
    padding: 0 var(--space-2);
    transition: color 0.15s linear;
  }

  li:hover {
    color: var(--green-5);
    fill: var(--green-5);
  }

  .selected {
    color: var(--green-5);
    fill: var(--green-5);
  }

  li:nth-of-type(2) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  li:nth-of-type(2) > svg {
    width: 14px;
    margin-left: var(--space-1);
    fill: inherit;
  }

  /* social */

  .social {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .social > span {
    font-family: Roboto;
    font-size: var(--font-size-1);
    font-weight: 500;
    color: var(--grey-6);
  }

  .social > a {
    padding-left: var(--space-2);
  }

  svg {
    width: 24px;
    fill: var(--grey-8);
    transition: fill 0.1s linear;
  }

  svg:hover {
    fill: var(--grey-6);
  }

  /* hover nav */
  .hover-nav {
    overflow: hidden;
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

  .hover-nav > div {
    display: grid;
    grid-template-columns: auto auto 1fr;
    width: 75vw;
    margin: 0 auto;
    height: 100%;
  }

  .hover-nav > div > ul {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .hover-nav > div > ul > li {
    color: var(--grey-0);
  }
</style>

<nav>
  <div class="nav-wrap">
    <div class="nav-main-items">
      <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DDSH-logo.png" alt="DD-logo" /></a>
      <ul>
        <li><a href="/about" sveltekit:prefetch>關於我們</a></li>
        <li class:selected={showHoverNav} on:click={handleClick}>
          分類文章<svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.05882 0L9 6.22222L16.9412 0L18 0.802519L9 8L0 0.802519L1.05882 0Z" />
          </svg>
        </li>
        <li><a href="/category/1213121" sveltekit:prefetch>好用工具</a></li>
        <li><a href="/category/1312121" sveltekit:prefetch>近期活動</a></li>
      </ul>
      <div class="social">
        <span>FOLLOW US</span>
        <a href="https://medium.com/dd-story-hub" target="_blank"
          ><svg viewBox="0 0 256 256" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
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
    <div class:show-hover-nav={showHoverNav} class="hover-nav">
      <div>
        <span style="width: 226px;" />
        <ul>
          <li><a href="/sdfsdfe" sveltekit:prefetch>資訊圖表</a></li>
          <li><a href="/sdfsdfe" sveltekit:prefetch>資料分析</a></li>
          <li><a href="/sdfsdfe" sveltekit:prefetch>數位敘事</a></li>
          <li><a href="/sdfsdfe" sveltekit:prefetch>經驗分享</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>
