<style>
  .container {
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }

  h1 {
    font-size: var(--font-size-5);
    color: var(--green-5);
    margin-bottom: var(--space-5);
  }

  .wrap > p {
    font-size: var(--font-size-3);
    line-height: var(--line-height-body);
    color: var(--grey-8);
    padding-bottom: var(--space-4);
  }

  .wrap > p:last-of-type {
    padding-bottom: var(--space-7);
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 0 var(--space-8) 0;
      width: 85vw;
      margin: 0 auto;
    }

    .wrap {
      width: 570px;
    }

    h1 {
      font-size: var(--font-size-7);
    }

    .wrap > p {
      line-height: var(--line-height-body-d);
      padding-bottom: var(--space-5);
    }

    .wrap > p:last-of-type {
      padding-bottom: var(--space-9);
    }
  }

  button {
    display: block;
    margin: 0 0 var(--space-10) 0;
    font-size: var(--font-size-2);
    color: var(--grey-0);
    background-color: var(--green-5);
    padding: var(--space-1) var(--space-7);
  }

  button:focus {
    outline: 0;
  }

  @media (min-width: 1024px) {
    .container {
      width: 75vw;
    }
  }
</style>

<svelte:head>
  <title>感謝訂閱！ - DD Story Hub 融數基地</title>
  <meta name="robots" content="noindex" />
  <meta name="googlebot" content="noindex" />
</svelte:head>

<div class="container">
  <div class="wrap">
    <h1>您已經成功訂閱電子報！</h1>
    <p>至讀者：</p>
    <p>謝謝您訂閱我們的電子報，您將收到我們最新的文章，以及不定期推出的特別企劃內容。</p>
    <p>您的資料僅作為電子報發送使用，我們不會發送給您任何廣告資訊。</p>
    <p>若您對電子報內容或信件資料有任何問題，請不吝來信聯繫<br />（ddstoryhub@gmail.com）。</p>
  </div>
  <a href="/" sveltekit:prefetch><button>暸解，回到主網站</button></a>
</div>
