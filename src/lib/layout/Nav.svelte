<script>
  import { fade } from 'svelte/transition'

  export let isArticleNav = false
  export let pageUrl = 'https://ddstoryhub.com'

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
    width: 85vw;
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
    margin-left: var(--space-2);
  }

  .social-icon,
  .share-icon {
    width: 24px;
    fill: var(--grey-8);
    transition: opacity 0.1s linear;
  }

  .social-icon:hover,
  .share-icon:hover {
    opacity: 0.8;
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
    width: 85vw;
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

  @media (min-width: 1024px) {
    .hover-nav > div,
    .nav-main-items {
      width: 75vw;
      max-width: 1200px;
    }
  }
</style>

<nav>
  <div class="nav-wrap">
    <div class="nav-main-items">
      <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DDSH-logo.svg" alt="DD-logo" /></a>
      <ul>
        <li><a href="/about" sveltekit:prefetch>關於我們</a></li>
        <li class:selected={showHoverNav} on:click={handleClick}>
          分類文章<svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.05882 0L9 6.22222L16.9412 0L18 0.802519L9 8L0 0.802519L1.05882 0Z" />
          </svg>
        </li>
        <!-- <li><a href="/tools" sveltekit:prefetch>好用工具</a></li>
        <li><a href="/events" sveltekit:prefetch>近期活動</a></li> -->
      </ul>
      <div class="social">
        {#if isArticleNav}
          <span in:fade={{ duration: 200 }}>SHARE</span>
          <a
            class="share-icon"
            in:fade={{ duration: 200 }}
            href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
            target="_blank"
          >
            <svg class="nav-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 9.05025C0 13.5248 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3503 3.6 12.9998 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
                fill="#343A40"
              />
            </svg>
          </a>
          <a
            class="share-icon"
            in:fade={{ duration: 200 }}
            href={`https://lineit.line.me/share/ui?url=${pageUrl}`}
            target="_blank"
          >
            <svg class="nav-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5221 7.39743C14.5856 7.39524 14.6489 7.40586 14.7083 7.42866C14.7676 7.45146 14.8217 7.48598 14.8675 7.53015C14.9132 7.57432 14.9495 7.62724 14.9744 7.68576C14.9992 7.74428 15.012 7.8072 15.012 7.87077C15.012 7.93434 14.9992 7.99726 14.9744 8.05578C14.9495 8.1143 14.9132 8.16722 14.8675 8.2114C14.8217 8.25557 14.7676 8.29008 14.7083 8.31288C14.6489 8.33568 14.5856 8.3463 14.5221 8.34411H13.2064V9.18786H14.5221C14.586 9.18474 14.6499 9.19464 14.7098 9.21694C14.7698 9.23925 14.8246 9.27351 14.871 9.31764C14.9173 9.36177 14.9542 9.41486 14.9794 9.47367C15.0046 9.53249 15.0176 9.59581 15.0176 9.6598C15.0176 9.72379 15.0046 9.78712 14.9794 9.84593C14.9542 9.90475 14.9173 9.95783 14.871 10.002C14.8246 10.0461 14.7698 10.0804 14.7098 10.1027C14.6499 10.125 14.586 10.1349 14.5221 10.1317H12.735C12.6101 10.1313 12.4904 10.0814 12.4022 9.99295C12.314 9.90451 12.2643 9.78473 12.2642 9.6598V6.0823C12.2642 5.82186 12.4751 5.60811 12.735 5.60811H14.5254C14.6469 5.61439 14.7613 5.66715 14.8449 5.75547C14.9285 5.84379 14.975 5.96089 14.9746 6.08252C14.9743 6.20414 14.9271 6.32097 14.843 6.40879C14.7588 6.4966 14.6441 6.54869 14.5226 6.55424H13.2069V7.39799L14.5221 7.39743ZM11.6342 9.65924C11.6332 9.78452 11.5827 9.90432 11.4938 9.9926C11.4049 10.0809 11.2847 10.1305 11.1594 10.1306C11.0853 10.1313 11.0119 10.1148 10.9452 10.0823C10.8786 10.0498 10.8204 10.0022 10.7753 9.9433L8.94431 7.45311V9.65868C8.94431 9.78384 8.89459 9.90388 8.80609 9.99239C8.71758 10.0809 8.59754 10.1306 8.47237 10.1306C8.34721 10.1306 8.22717 10.0809 8.13867 9.99239C8.05016 9.90388 8.00044 9.78384 8.00044 9.65868V6.08118C8.00044 5.87924 8.13262 5.69811 8.32275 5.63343C8.3697 5.61684 8.41921 5.60865 8.469 5.60924C8.61525 5.60924 8.75025 5.68855 8.84081 5.79993L10.6864 8.29574V6.08118C10.6864 5.82074 10.8973 5.60699 11.1583 5.60699C11.4193 5.60699 11.6331 5.82074 11.6331 6.08118L11.6342 9.65924ZM7.32769 9.65924C7.32709 9.78471 7.27679 9.90483 7.18781 9.99329C7.09882 10.0817 6.97841 10.1313 6.85294 10.1312C6.7284 10.1301 6.60931 10.08 6.52157 9.9916C6.43382 9.90322 6.38452 9.78378 6.38438 9.65924V6.08174C6.38438 5.8213 6.59531 5.60755 6.85631 5.60755C7.11675 5.60755 7.32825 5.8213 7.32825 6.08174L7.32769 9.65924ZM5.47875 10.1312H3.68831C3.56298 10.1309 3.44282 10.0812 3.35393 9.9928C3.26504 9.90443 3.2146 9.78457 3.21356 9.65924V6.08174C3.21356 5.8213 3.42731 5.60755 3.68831 5.60755C3.94931 5.60755 4.16025 5.8213 4.16025 6.08174V9.1873H5.47875C5.60392 9.1873 5.72395 9.23702 5.81246 9.32553C5.90097 9.41403 5.95069 9.53407 5.95069 9.65924C5.95069 9.7844 5.90097 9.90444 5.81246 9.99295C5.72395 10.0815 5.60392 10.1312 5.47875 10.1312ZM18 7.7338C18 3.70574 13.9596 0.42749 9 0.42749C4.04044 0.42749 0 3.70574 0 7.7338C0 11.3434 3.20231 14.3668 7.52625 14.9411C7.81931 15.0024 8.21756 15.1346 8.3205 15.3838C8.41106 15.6088 8.379 15.9576 8.34975 16.1955L8.22656 16.9599C8.19112 17.1855 8.04488 17.8481 9.01181 17.4437C9.98156 17.0392 14.2003 14.3854 16.0898 12.2107C17.3818 10.7961 18 9.34255 18 7.7338Z"
                fill="#343A40"
              />
            </svg>
          </a>
        {:else}
          <span in:fade={{ duration: 200 }}>FOLLOW US</span>
          <a class="social-icon" in:fade={{ duration: 200 }} href="https://medium.com/dd-story-hub" target="_blank"
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
          <a class="social-icon" in:fade={{ duration: 200 }} href="https://www.facebook.com/ddstoryhub" target="_blank"
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
        {/if}
      </div>
    </div>
    <div class:show-hover-nav={showHoverNav} class="hover-nav">
      <div>
        <span style="width: 242px;" />
        <ul>
          <li><a href="/category/graphic" sveltekit:prefetch on:click={handleClick}>資訊圖表</a></li>
          <li><a href="/category/data-analysis" sveltekit:prefetch on:click={handleClick}>資料分析</a></li>
          <li><a href="/category/digital-storytelling" sveltekit:prefetch on:click={handleClick}>數位敘事</a></li>
          <li><a href="/category/experience" sveltekit:prefetch on:click={handleClick}>經驗分享</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>
