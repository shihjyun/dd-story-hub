<script>
  import { fade, slide } from 'svelte/transition'

  export let isArticleNav = false
  export let pageUrl = 'https://ddstoryhub.com'

  let showNav = false
  let showSubNav = false
  let showNormalShareIcon = false
  let showBottomShareList = false
  let copyTipCount = 1

  // handle copy page url
  function handleClickCopyBtn() {
    copyTipCount += 1
    navigator.clipboard.writeText(pageUrl)
  }

  // create intersection observer to detect user scroll over the h1 tag
  let observer
  $: if (isArticleNav) {
    observer = new IntersectionObserver(function (entry) {
      // check article h1 exist or not -> when user switch to other pages,
      // avoid to trigger `showNormalShareIcon = true` again
      if (entry[0].isIntersecting === false && document.querySelector('.article-meta > h1')) {
        showNormalShareIcon = true
      } else {
        showNormalShareIcon = false
      }
    })
    setTimeout(() => {
      observer.observe(document.querySelector('.article-meta > h1'))
    }, 500)
  }
</script>

<style>
  nav {
    background-color: #fdfdfd;
    position: sticky;
    top: 0;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.15);
    margin-bottom: var(--space-4);
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
    opacity: 0.45;
  }
  .content {
    position: fixed;
    top: 0;
    left: 26vw;
    width: 75vw;
    height: 101vh;
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
    margin: var(--space-4) 0 var(--space-11) var(--space-4);
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

  /* right items */
  .right-items {
    display: flex;
    align-items: center;
  }

  .right-items > span {
    font-family: Roboto;
    font-weight: 500;
    font-size: var(--font-size-1);
    color: var(--grey-7);
    margin-right: var(--space-2);
  }

  .right-items > a {
    margin-right: var(--space-2);
  }

  /* bottom-share-list */
  .bottom-share-list {
    position: fixed;
    bottom: 0;
    background-color: var(--grey-0);
    height: 145px;
    width: 100vw;
    padding: var(--space-5);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  .share-list-title {
    font-family: Roboto;
    font-weight: 500;
    font-size: var(--font-size-3);
    color: var(--grey-7);
    text-align: center;
    margin-bottom: var(--space-6);
  }

  .share-icon-list {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-3);
  }
  .share-list-cancel {
    position: absolute;
    top: var(--space-5);
    right: var(--space-5);
  }

  .copy-tip {
    position: absolute;
    top: 55px;
    right: 75px;
    font-size: var(--font-size-0);
    padding: var(--space-0) var(--space-1);
    background-color: var(--grey-5);
    opacity: 0;
    color: var(--grey-0);
  }

  .show-copy-tip {
    animation-name: tip-animation;
    animation-duration: 1200ms;
  }

  @keyframes tip-animation {
    from {
      opacity: 0.7;
    }
    to {
      opacity: 0;
    }
  }
</style>

<nav>
  <div class="nav-wrap">
    <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DDSH-logo.svg" alt="DD-logo" /></a>
    <div class="right-items">
      <!-- social icon **article page only** -->
      {#if isArticleNav && !showNormalShareIcon}
        <span in:fade={{ duration: 200 }}>SHARE</span>
        <a in:fade={{ duration: 200 }} href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 9.05025C0 13.5248 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3503 3.6 12.9998 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
              fill="#343A40"
            />
          </svg>
        </a>
        <a in:fade={{ duration: 200 }} href={`https://lineit.line.me/share/ui?url=${pageUrl}`} target="_blank">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.5221 7.39743C14.5856 7.39524 14.6489 7.40586 14.7083 7.42866C14.7676 7.45146 14.8217 7.48598 14.8675 7.53015C14.9132 7.57432 14.9495 7.62724 14.9744 7.68576C14.9992 7.74428 15.012 7.8072 15.012 7.87077C15.012 7.93434 14.9992 7.99726 14.9744 8.05578C14.9495 8.1143 14.9132 8.16722 14.8675 8.2114C14.8217 8.25557 14.7676 8.29008 14.7083 8.31288C14.6489 8.33568 14.5856 8.3463 14.5221 8.34411H13.2064V9.18786H14.5221C14.586 9.18474 14.6499 9.19464 14.7098 9.21694C14.7698 9.23925 14.8246 9.27351 14.871 9.31764C14.9173 9.36177 14.9542 9.41486 14.9794 9.47367C15.0046 9.53249 15.0176 9.59581 15.0176 9.6598C15.0176 9.72379 15.0046 9.78712 14.9794 9.84593C14.9542 9.90475 14.9173 9.95783 14.871 10.002C14.8246 10.0461 14.7698 10.0804 14.7098 10.1027C14.6499 10.125 14.586 10.1349 14.5221 10.1317H12.735C12.6101 10.1313 12.4904 10.0814 12.4022 9.99295C12.314 9.90451 12.2643 9.78473 12.2642 9.6598V6.0823C12.2642 5.82186 12.4751 5.60811 12.735 5.60811H14.5254C14.6469 5.61439 14.7613 5.66715 14.8449 5.75547C14.9285 5.84379 14.975 5.96089 14.9746 6.08252C14.9743 6.20414 14.9271 6.32097 14.843 6.40879C14.7588 6.4966 14.6441 6.54869 14.5226 6.55424H13.2069V7.39799L14.5221 7.39743ZM11.6342 9.65924C11.6332 9.78452 11.5827 9.90432 11.4938 9.9926C11.4049 10.0809 11.2847 10.1305 11.1594 10.1306C11.0853 10.1313 11.0119 10.1148 10.9452 10.0823C10.8786 10.0498 10.8204 10.0022 10.7753 9.9433L8.94431 7.45311V9.65868C8.94431 9.78384 8.89459 9.90388 8.80609 9.99239C8.71758 10.0809 8.59754 10.1306 8.47237 10.1306C8.34721 10.1306 8.22717 10.0809 8.13867 9.99239C8.05016 9.90388 8.00044 9.78384 8.00044 9.65868V6.08118C8.00044 5.87924 8.13262 5.69811 8.32275 5.63343C8.3697 5.61684 8.41921 5.60865 8.469 5.60924C8.61525 5.60924 8.75025 5.68855 8.84081 5.79993L10.6864 8.29574V6.08118C10.6864 5.82074 10.8973 5.60699 11.1583 5.60699C11.4193 5.60699 11.6331 5.82074 11.6331 6.08118L11.6342 9.65924ZM7.32769 9.65924C7.32709 9.78471 7.27679 9.90483 7.18781 9.99329C7.09882 10.0817 6.97841 10.1313 6.85294 10.1312C6.7284 10.1301 6.60931 10.08 6.52157 9.9916C6.43382 9.90322 6.38452 9.78378 6.38438 9.65924V6.08174C6.38438 5.8213 6.59531 5.60755 6.85631 5.60755C7.11675 5.60755 7.32825 5.8213 7.32825 6.08174L7.32769 9.65924ZM5.47875 10.1312H3.68831C3.56298 10.1309 3.44282 10.0812 3.35393 9.9928C3.26504 9.90443 3.2146 9.78457 3.21356 9.65924V6.08174C3.21356 5.8213 3.42731 5.60755 3.68831 5.60755C3.94931 5.60755 4.16025 5.8213 4.16025 6.08174V9.1873H5.47875C5.60392 9.1873 5.72395 9.23702 5.81246 9.32553C5.90097 9.41403 5.95069 9.53407 5.95069 9.65924C5.95069 9.7844 5.90097 9.90444 5.81246 9.99295C5.72395 10.0815 5.60392 10.1312 5.47875 10.1312ZM18 7.7338C18 3.70574 13.9596 0.42749 9 0.42749C4.04044 0.42749 0 3.70574 0 7.7338C0 11.3434 3.20231 14.3668 7.52625 14.9411C7.81931 15.0024 8.21756 15.1346 8.3205 15.3838C8.41106 15.6088 8.379 15.9576 8.34975 16.1955L8.22656 16.9599C8.19112 17.1855 8.04488 17.8481 9.01181 17.4437C9.98156 17.0392 14.2003 14.3854 16.0898 12.2107C17.3818 10.7961 18 9.34255 18 7.7338Z"
              fill="#343A40"
            />
          </svg>
        </a>
        <!-- when user scroll under the h1, then show this normal share icon **article page only** -->
      {:else if isArticleNav && showNormalShareIcon}
        <svg
          in:fade={{ duration: 200 }}
          on:click={() => (showBottomShareList = !showBottomShareList)}
          class="nav-icon"
          style="margin-right: var(--space-3);"
          width="19"
          height="20"
          viewBox="0 0 19 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.04158 12.75C4.84335 12.7476 5.61478 12.4432 6.20216 11.8975L11.9405 15.1764C11.7482 15.9277 11.833 16.7231 12.1792 17.4171C12.5255 18.111 13.1101 18.657 13.826 18.9551C14.542 19.2532 15.3413 19.2835 16.0778 19.0404C16.8142 18.7974 17.4385 18.2972 17.8363 17.6315C18.2341 16.9658 18.3788 16.1791 18.2439 15.4153C18.1091 14.6516 17.7037 13.9621 17.102 13.4728C16.5003 12.9836 15.7425 12.7274 14.9673 12.7512C14.1922 12.775 13.4515 13.0772 12.881 13.6025L7.14266 10.3236C7.20316 10.0944 7.23616 9.857 7.24166 9.61958L12.8792 6.3975C13.422 6.89137 14.1182 7.18354 14.8509 7.22499C15.5836 7.26643 16.3082 7.05463 16.9033 6.62512C17.4984 6.19561 17.9276 5.57452 18.119 4.86604C18.3104 4.15757 18.2524 3.40481 17.9546 2.73407C17.6568 2.06333 17.1374 1.5154 16.4835 1.18221C15.8296 0.849023 15.0811 0.750848 14.3634 0.904154C13.6457 1.05746 13.0025 1.45292 12.5419 2.02419C12.0812 2.59546 11.831 3.30779 11.8332 4.04166C11.8369 4.30566 11.8727 4.56875 11.9405 4.82358L6.73016 7.8C6.42801 7.33255 6.00944 6.95176 5.51559 6.69502C5.02174 6.43829 4.4696 6.31445 3.91341 6.33567C3.35721 6.35689 2.81611 6.52244 2.34326 6.81606C1.8704 7.10968 1.48207 7.52126 1.21642 8.01037C0.950757 8.49947 0.816913 9.04928 0.828033 9.60576C0.839153 10.1623 0.994854 10.7063 1.27984 11.1844C1.56482 11.6625 1.96929 12.0582 2.45349 12.3327C2.9377 12.6072 3.48498 12.751 4.04158 12.75Z"
          />
        </svg>
      {/if}

      <svg
        on:click={() => (showNav = !showNav)}
        class="nav-icon"
        width="22"
        height="16"
        viewBox="0 0 22 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 11.4286H22V9.14286H0V11.4286ZM0 16H22V13.7143H0V16ZM0 6.85714H22V4.57143H0V6.85714ZM0 0V2.28571H22V0H0Z"
        />
      </svg>
    </div>
  </div>
  <!-- ****hidden nav items**** -->
  <!-- dark background -->
  {#if showNav}
    <div transition:fade={{ duration: 200 }} on:click={() => (showNav = !showNav)} class="content-bg" />
  {/if}
  <!-- hidden left nav -->
  <div class:show-main-items={showNav} class="content">
    <svg
      on:click={() => (showNav = !showNav)}
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
      <li><a href="/" sveltekit:prefetch on:click={() => (showNav = !showNav)}>回首頁</a></li>
      <li><a href="/about" sveltekit:prefetch on:click={() => (showNav = !showNav)}>關於我們</a></li>
      <li class="sub-items-wrap">
        <div class:highlight={showSubNav} on:click={() => (showSubNav = !showSubNav)}>
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
          <li><a href="/category/graphic" sveltekit:prefetch on:click={() => (showNav = !showNav)}>資訊圖表</a></li>
          <li>
            <a href="/category/data-analysis" sveltekit:prefetch on:click={() => (showNav = !showNav)}>資料分析</a>
          </li>
          <li>
            <a href="/category/digital-storytelling" sveltekit:prefetch on:click={() => (showNav = !showNav)}
              >數位敘事</a
            >
          </li>
          <li><a href="/category/experience" sveltekit:prefetch on:click={() => (showNav = !showNav)}>經驗分享</a></li>
        </ul>
      </li>
      <!-- <li><a href="/tools" sveltekit:prefetch on:click={() => (showNav = !showNav)}>好用工具</a></li>
      <li><a href="/events" sveltekit:prefetch on:click={() => (showNav = !showNav)}>近期活動</a></li> -->
    </ul>
    <!-- social -->
    <div class="social">
      <a class="nav-icon" href="https://medium.com/dd-story-hub" target="_blank"
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
      <a class="nav-icon" href="https://www.facebook.com/ddstoryhub" target="_blank"
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
  <!-- ****article bottom share list**** -->
  <!-- dark background -->
  {#if showBottomShareList}
    <div
      transition:fade={{ duration: 200 }}
      on:click={() => {
        showBottomShareList = !showBottomShareList
        // reset copy tip count
        copyTipCount = 1
      }}
      class="content-bg"
    />
  {/if}
  {#if isArticleNav && showBottomShareList}
    <div transition:slide class="bottom-share-list">
      <div class="share-list-title">SHARE</div>
      <svg
        on:click={() => {
          showBottomShareList = !showBottomShareList
          // reset copy tip count
          copyTipCount = 1
        }}
        class="share-list-cancel"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.75 2.0125L15.9875 0.25L9 7.2375L2.0125 0.25L0.25 2.0125L7.2375 9L0.25 15.9875L2.0125 17.75L9 10.7625L15.9875 17.75L17.75 15.9875L10.7625 9L17.75 2.0125Z"
          fill="#343A40"
        />
      </svg>
      {#key copyTipCount}
        <div class:show-copy-tip={copyTipCount !== 1} class="copy-tip">複製成功</div>
      {/key}

      <div class="share-icon-list">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank">
          <svg class="nav-icon" width="35" height="35" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 9.05025C0 13.5248 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3503 3.6 12.9998 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
              fill="#343A40"
            />
          </svg>
        </a>
        <a href={`https://twitter.com/share?url=${pageUrl}`} target="_blank">
          <svg class="nav-icon" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 0.5C8.33594 0.5 0.5 8.33594 0.5 18C0.5 27.6641 8.33594 35.5 18 35.5C27.6641 35.5 35.5 27.6641 35.5 18C35.5 8.33594 27.6641 0.5 18 0.5ZM26.4102 13.6914C26.4219 13.875 26.4219 14.0664 26.4219 14.2539C26.4219 19.9883 22.0547 26.5938 14.0742 26.5938C11.6133 26.5938 9.33203 25.8789 7.41016 24.6484C7.76172 24.6875 8.09766 24.7031 8.45703 24.7031C10.4883 24.7031 12.3555 24.0156 13.8438 22.8516C11.9375 22.8125 10.3359 21.5625 9.78906 19.8438C10.457 19.9414 11.0586 19.9414 11.7461 19.7656C10.7646 19.5662 9.88232 19.0331 9.24928 18.257C8.61624 17.4808 8.27143 16.5094 8.27344 15.5078V15.4531C8.84766 15.7773 9.52344 15.9766 10.2305 16.0039C9.6361 15.6078 9.14866 15.0711 8.81137 14.4415C8.47408 13.8119 8.29736 13.1088 8.29688 12.3945C8.29688 11.5859 8.50781 10.8477 8.88672 10.207C9.97618 11.5482 11.3357 12.6451 12.8768 13.4264C14.418 14.2078 16.1063 14.6561 17.832 14.7422C17.2188 11.793 19.4219 9.40625 22.0703 9.40625C23.3203 9.40625 24.4453 9.92969 25.2383 10.7734C26.2188 10.5898 27.1562 10.2227 27.9922 9.73047C27.668 10.7344 26.9883 11.582 26.0859 12.1172C26.9609 12.0234 27.8047 11.7812 28.5859 11.4414C27.9961 12.3086 27.2578 13.0781 26.4102 13.6914Z"
              fill="#343A40"
            />
          </svg>
        </a>
        <a href={`https://lineit.line.me/share/ui?url=${pageUrl}`} target="_blank">
          <svg class="nav-icon" width="35" height="33.4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.5221 7.39743C14.5856 7.39524 14.6489 7.40586 14.7083 7.42866C14.7676 7.45146 14.8217 7.48598 14.8675 7.53015C14.9132 7.57432 14.9495 7.62724 14.9744 7.68576C14.9992 7.74428 15.012 7.8072 15.012 7.87077C15.012 7.93434 14.9992 7.99726 14.9744 8.05578C14.9495 8.1143 14.9132 8.16722 14.8675 8.2114C14.8217 8.25557 14.7676 8.29008 14.7083 8.31288C14.6489 8.33568 14.5856 8.3463 14.5221 8.34411H13.2064V9.18786H14.5221C14.586 9.18474 14.6499 9.19464 14.7098 9.21694C14.7698 9.23925 14.8246 9.27351 14.871 9.31764C14.9173 9.36177 14.9542 9.41486 14.9794 9.47367C15.0046 9.53249 15.0176 9.59581 15.0176 9.6598C15.0176 9.72379 15.0046 9.78712 14.9794 9.84593C14.9542 9.90475 14.9173 9.95783 14.871 10.002C14.8246 10.0461 14.7698 10.0804 14.7098 10.1027C14.6499 10.125 14.586 10.1349 14.5221 10.1317H12.735C12.6101 10.1313 12.4904 10.0814 12.4022 9.99295C12.314 9.90451 12.2643 9.78473 12.2642 9.6598V6.0823C12.2642 5.82186 12.4751 5.60811 12.735 5.60811H14.5254C14.6469 5.61439 14.7613 5.66715 14.8449 5.75547C14.9285 5.84379 14.975 5.96089 14.9746 6.08252C14.9743 6.20414 14.9271 6.32097 14.843 6.40879C14.7588 6.4966 14.6441 6.54869 14.5226 6.55424H13.2069V7.39799L14.5221 7.39743ZM11.6342 9.65924C11.6332 9.78452 11.5827 9.90432 11.4938 9.9926C11.4049 10.0809 11.2847 10.1305 11.1594 10.1306C11.0853 10.1313 11.0119 10.1148 10.9452 10.0823C10.8786 10.0498 10.8204 10.0022 10.7753 9.9433L8.94431 7.45311V9.65868C8.94431 9.78384 8.89459 9.90388 8.80609 9.99239C8.71758 10.0809 8.59754 10.1306 8.47237 10.1306C8.34721 10.1306 8.22717 10.0809 8.13867 9.99239C8.05016 9.90388 8.00044 9.78384 8.00044 9.65868V6.08118C8.00044 5.87924 8.13262 5.69811 8.32275 5.63343C8.3697 5.61684 8.41921 5.60865 8.469 5.60924C8.61525 5.60924 8.75025 5.68855 8.84081 5.79993L10.6864 8.29574V6.08118C10.6864 5.82074 10.8973 5.60699 11.1583 5.60699C11.4193 5.60699 11.6331 5.82074 11.6331 6.08118L11.6342 9.65924ZM7.32769 9.65924C7.32709 9.78471 7.27679 9.90483 7.18781 9.99329C7.09882 10.0817 6.97841 10.1313 6.85294 10.1312C6.7284 10.1301 6.60931 10.08 6.52157 9.9916C6.43382 9.90322 6.38452 9.78378 6.38438 9.65924V6.08174C6.38438 5.8213 6.59531 5.60755 6.85631 5.60755C7.11675 5.60755 7.32825 5.8213 7.32825 6.08174L7.32769 9.65924ZM5.47875 10.1312H3.68831C3.56298 10.1309 3.44282 10.0812 3.35393 9.9928C3.26504 9.90443 3.2146 9.78457 3.21356 9.65924V6.08174C3.21356 5.8213 3.42731 5.60755 3.68831 5.60755C3.94931 5.60755 4.16025 5.8213 4.16025 6.08174V9.1873H5.47875C5.60392 9.1873 5.72395 9.23702 5.81246 9.32553C5.90097 9.41403 5.95069 9.53407 5.95069 9.65924C5.95069 9.7844 5.90097 9.90444 5.81246 9.99295C5.72395 10.0815 5.60392 10.1312 5.47875 10.1312ZM18 7.7338C18 3.70574 13.9596 0.42749 9 0.42749C4.04044 0.42749 0 3.70574 0 7.7338C0 11.3434 3.20231 14.3668 7.52625 14.9411C7.81931 15.0024 8.21756 15.1346 8.3205 15.3838C8.41106 15.6088 8.379 15.9576 8.34975 16.1955L8.22656 16.9599C8.19112 17.1855 8.04488 17.8481 9.01181 17.4437C9.98156 17.0392 14.2003 14.3854 16.0898 12.2107C17.3818 10.7961 18 9.34255 18 7.7338Z"
              fill="#343A40"
            />
          </svg>
        </a>
        <svg
          on:click={handleClickCopyBtn}
          class="nav-icon"
          width="25"
          height="26"
          viewBox="0 0 25 26"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.31415 10.8106L2.3129 13.8119C1.08209 15.0427 0.390625 16.712 0.390625 18.4527C0.390625 20.1933 1.08209 21.8626 2.3129 23.0934C3.54371 24.3242 5.21305 25.0157 6.95368 25.0157C8.69431 25.0157 10.3637 24.3242 11.5945 23.0934L15.5932 19.0925C16.3354 18.3502 16.8887 17.4407 17.2067 16.4403C17.5247 15.4399 17.598 14.3778 17.4206 13.3432C17.2431 12.3086 16.8201 11.3316 16.187 10.4943C15.5538 9.65703 14.7291 8.98384 13.782 8.53125L12.5001 9.81312C12.37 9.9435 12.2568 10.0898 12.1632 10.2484C12.895 10.4588 13.5592 10.8565 14.0902 11.4023C14.6211 11.948 15.0005 12.6228 15.1907 13.3601C15.3809 14.0974 15.3755 14.8715 15.1748 15.606C14.9742 16.3405 14.5853 17.01 14.0467 17.5481L10.0501 21.5469C9.22916 22.3678 8.11574 22.829 6.95478 22.829C5.79381 22.829 4.68039 22.3678 3.85946 21.5469C3.03853 20.7259 2.57734 19.6125 2.57734 18.4516C2.57734 17.2906 3.03853 16.1772 3.85946 15.3562L5.59415 13.6238C5.3494 12.7066 5.25484 11.7558 5.31415 10.8084V10.8106Z"
            fill="#343A40"
          />
          <path
            d="M9.40689 6.7201C8.66468 7.46241 8.11138 8.37194 7.79341 9.37234C7.47545 10.3727 7.4021 11.4348 7.57954 12.4694C7.75697 13.504 8.18001 14.481 8.81314 15.3183C9.44626 16.1556 10.271 16.8288 11.2181 17.2813L12.9135 15.5838C12.1718 15.3849 11.4955 14.9943 10.9527 14.4512C10.4098 13.9081 10.0194 13.2317 9.82079 12.4899C9.62216 11.7481 9.62226 10.9672 9.82108 10.2254C10.0199 9.48374 10.4104 8.80743 10.9535 8.26447L14.95 4.26572C15.7709 3.44479 16.8844 2.9836 18.0453 2.9836C19.2063 2.9836 20.3197 3.44479 21.1406 4.26572C21.9616 5.08665 22.4228 6.20007 22.4228 7.36103C22.4228 8.522 21.9616 9.63542 21.1406 10.4563L19.406 12.1888C19.651 13.1076 19.745 14.0592 19.686 15.0042L22.6872 12.0029C23.918 10.7721 24.6095 9.10276 24.6095 7.36213C24.6095 5.6215 23.918 3.95216 22.6872 2.72135C21.4564 1.49054 19.7871 0.799072 18.0464 0.799072C16.3058 0.799072 14.6365 1.49054 13.4056 2.72135L9.40689 6.7201Z"
            fill="#343A40"
          />
        </svg>
      </div>
    </div>
  {/if}
</nav>
