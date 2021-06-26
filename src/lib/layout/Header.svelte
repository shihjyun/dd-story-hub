<script>
  // your script goes here
</script>

<style>
  header {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .logo {
    width: 140px;
    transform: translateY(3px);
    transition: transform 0.1s ease-out;
  }

  .logo:hover {
    transform: translateY(0px);
  }

  ul {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-6);
  }

  li {
    padding: 0 var(--space-1);
    font-size: var(--font-size-1);
    letter-spacing: 0.1em;
    color: var(--gray-5);
    transition: color 0.15s linear;
    border-left: 1px var(--gray-4) solid;
  }

  li:first-of-type {
    border-left: none;
  }

  li:hover {
    color: var(--green-5);
  }

  @media (min-width: 576px) {
    .logo {
      width: 180px;
    }

    ul {
      margin-bottom: var(--space-7);
    }

    li {
      padding: 0 var(--space-3);
      font-size: var(--font-size-2);
      transition: color 0.15s linear;
      border-left: 1px var(--gray-4) solid;
    }
  }
</style>

<header>
  <a class="logo" href="/" sveltekit:prefetch><img src="/assets/index/DD-avatar-text-en.svg" alt="DD-logo" /></a>
  <ul>
    <li><a href="/about" sveltekit:prefetch>關於我們</a></li>
    <li><a href="/category/data-story" sveltekit:prefetch>資料故事</a></li>
    <li><a href="/category/experience-sharing" sveltekit:prefetch>經驗分享</a></li>
    <li><a href="/category/research" sveltekit:prefetch>敘事研究</a></li>
  </ul>
</header>
