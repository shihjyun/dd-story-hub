<script context="module">
  export async function load({ page, fetch }) {
    const pageSlug = page.path.replace('/article/', '')
    // get all articles meta
    const articles = await fetch('/article.json').then((res) => res.json())
    // get article meta
    const article = await articles.filter((d) => d.slug === pageSlug)[0]
    // get author infomation
    const author = await fetch('/assets/author/authors.json')
      .then((res) => res.json())
      .then((data) => data.filter((d) => d.id === article.author_id))
      .then((d) => d[0])
    // get current page url
    const pageUrl = page.host + page.path

    if (!article || !author) {
      return {
        status: 400,
        error: new Error('Article could not be found'),
      }
    }
    return {
      props: {
        articles,
        article,
        author,
        pageUrl,
        articlePath: page.path,
      },
    }
  }
</script>

<script>
  import { formatDate, categoryPathName } from '$lib/utils/utils.js'
  import ArticleBlock from '$lib/shared/ArticleBlock.svelte'
  import { isMobile } from '$lib/utils/MobileDetector'
  import { setContext } from 'svelte'

  export let articles
  export let article
  export let author
  export let pageUrl
  export let articlePath

  // let child components can access page prametes by setting setting context
  setContext('article-path', {
    path: articlePath,
  })

  // handle copy page url
  let copyTipCount = 1
  function handleClickCopyBtn() {
    copyTipCount += 1
    navigator.clipboard.writeText(pageUrl)
  }
</script>

<style>
  /* article meta data */
  .article-meta {
    width: 100%;
    margin: 0 auto;
    max-width: 570px;
    padding: 0 var(--space-4);
  }

  .article-meta > .category {
    font-size: var(--font-size-3);
    color: var(--green-5);
    margin-bottom: var(--space-4);
  }

  .article-meta > h1 {
    display: block;
    font-size: var(--font-size-6);
    font-weight: 600;
    line-height: var(--line-height-heading);
    letter-spacing: var(--letter-spacing-wide);
    color: var(--grey-7);
    margin-bottom: var(--space-4);
  }

  .article-meta > .author-date {
    color: var(--grey-5);
    letter-spacing: var(--letter-spacing-wide);
    font-size: var(--font-size-3);
    line-height: var(--line-height-body);
    margin-bottom: var(--space-4);
  }

  .author-date > a {
    font-weight: 500;
    text-decoration-line: underline;
    transition: opacity 0.1s linear;
  }

  .author-date > a:hover {
    opacity: 0.8;
  }

  .cover {
    width: 100vw;
    transform: translateX(calc(min(-20px, (530px - 100vw)/2)));
    margin-bottom: calc(var(--space-5) * 2);
  }

  .cover > img {
    margin-bottom: var(--space-4);
  }

  .cover > figcaption {
    font-size: var(--font-size-1);
    color: var(--grey-5);
    line-height: var(--font-family-body);
    padding-left: var(--space-4);
  }

  .tags {
    padding: 0 var(--space-4);
    margin-bottom: calc(var(--space-5) * 2);
  }

  .tags > span {
    display: inline-block;
    font-size: var(--font-size-2);
    color: var(--green-6);
    border: 1px rgba(222, 226, 230, 0.4) solid;
    border-radius: 40px;
    padding: var(--space-1) var(--space-3);
    margin-right: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .article-meta > blockquote {
    font-size: var(--font-size-3);
    font-weight: 300;
    color: var(--grey-7);
    padding-left: var(--space-3);
    border-left: 2px var(--grey-6) solid;
    margin-bottom: var(--space-5);
    line-height: var(--line-height-body);
  }

  article {
    width: 100%;
    margin: 0 auto;
    max-width: 570px;
    padding: 0 var(--space-4);
  }

  article > :global(h2) {
    display: block;
    font-weight: 500;
    font-size: var(--font-size-4);
    padding: var(--space-5) 0 var(--space-2) 0;
    line-height: var(--line-height-body);
  }

  article > :global(h3) {
    display: block;
    font-weight: 500;
    font-size: var(--font-size-3);
    padding: var(--space-5) 0 var(--space-2) 0;
    line-height: var(--line-height-body);
  }

  article > :global(p) {
    font-size: var(--font-size-3);
    font-weight: 400;
    color: var(--grey-7);
    line-height: var(--line-height-body);
    padding-bottom: var(--space-4);
  }

  article > :global(blockquote) {
    font-size: var(--font-size-3);
    font-weight: 300;
    color: var(--grey-7);
    padding-left: var(--space-3);
    border-left: 2px var(--grey-6) solid;
    margin-bottom: var(--space-5);
    line-height: var(--line-height-body);
  }

  article > :global(hr) {
    border-color: var(--grey-2);
    margin: calc(var(--space-5) + 10px) auto calc(var(--space-7) + 10px) auto;
    width: 75px;
    height: 1px;
  }

  article :global(p > a) {
    text-decoration-line: underline;
    transition: opacity 0.1s linear;
  }

  article :global(p > a:hover) {
    opacity: 0.8;
  }

  article :global(strong) {
    font-weight: 600;
  }

  article > :global(ul) {
    letter-spacing: var(--letter-spacing-wide);
    margin-left: var(--space-5);
    list-style-position: outside;
    list-style-type: disc;
  }

  article > :global(li) {
    font-size: var(--font-size-2);
    color: var(--grey-6);
    line-height: var(--line-height-3);
    letter-spacing: var(--letter-spacing-wide);
    padding-bottom: var(--space-4);
  }

  article > :global(li:last-of-type) {
    padding-bottom: var(--space-5);
  }

  /* author bottom */
  .author-bottom {
    display: flex;
    align-items: center;
    margin: var(--space-5) var(--space-4);
    padding: var(--space-4) 0;
    border-top: var(--grey-2) 2px solid;
    border-bottom: var(--grey-2) 2px solid;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
    background-color: var(--grey-3);
    border-radius: 100%;
  }

  .author-name {
    color: var(--grey-8);
    margin-left: var(--space-5);
  }

  .author-name > :nth-of-type(1) {
    font-size: var(--font-size-1);
  }

  .author-name > :nth-of-type(2) {
    font-size: var(--font-size-5);
  }

  /* share list */
  .share-list {
    position: relative;
    display: flex;
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }

  .share-icon-list {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .share-icon-list .share-icon {
    width: 25px;
  }

  .share-icon:hover {
    opacity: 0.8;
  }

  .share-icon-list > svg {
    width: 18px;
    cursor: pointer;
  }

  .copy-tip {
    position: absolute;
    top: -28px;
    left: 110px;
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

  /* read more */
  .read-more {
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }
  .read-more > .title {
    font-size: var(--space-5);
    color: var(--grey-7);
    padding-bottom: var(--space-6);
    margin-bottom: var(--space-4);
    border-bottom: 2px var(--grey-1) solid;
  }

  .read-more > .articles {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-8);
  }

  /* comment */
  .comments {
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }
  .comments > .title {
    font-size: var(--space-5);
    color: var(--grey-7);
    padding-bottom: var(--space-6);
    margin-bottom: var(--space-4);
    border-bottom: 2px var(--grey-1) solid;
  }

  @media (min-width: 768px) {
    /* article meta data */
    .article-meta {
      max-width: 768px;
      padding: 0;
    }

    .article-meta > .category {
      display: inline-block;
      margin-bottom: var(--space-3);
    }

    .article-meta > h1 {
      font-size: var(--font-size-8);
      margin-bottom: var(--space-3);
    }

    .article-meta > .author-date {
      margin-bottom: var(--space-3);
    }

    .cover {
      width: 100%;
      transform: none;
      margin-bottom: var(--space-8);
    }

    .cover > img {
      margin-bottom: var(--space-4);
    }

    .cover > figcaption {
      font-size: var(--font-size-3);
      padding-left: 0;
    }

    /* full cover article meta data */
    .full-cover {
      position: relative;
      width: 100vw;
      height: 52.5vw;
      max-height: calc(100vh - 50px);
      margin-top: calc(var(--space-6) * (-1));
      margin-bottom: var(--space-3);
      overflow: hidden;
    }

    .full-cover .cover {
      position: absolute;
    }

    .full-cover .dark-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(33, 37, 41, 0) 0%, rgba(33, 37, 41, 0.62) 100%);
    }

    .full-cover .article-meta {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: var(--space-0);
    }

    .full-cover .category {
      display: inline-block;
      color: var(--grey-0);
      background-color: var(--green-5);
      padding: var(--space-0) var(--space-0);
    }

    .full-cover h1 {
      color: var(--grey-0);
    }

    .full-cover .author-date {
      color: var(--grey-1);
    }

    /* tags */

    .tags {
      max-width: 570px;
      padding: 0;
      margin: 0 auto var(--space-8) auto;
    }

    .tags > span {
      font-size: var(--font-size-2);
      padding: var(--space-1) var(--space-3);
      margin-bottom: var(--space-3);
    }

    blockquote {
      font-size: var(--font-size-4);
      margin-bottom: var(--space-6);
    }

    article {
      width: 100%;
      margin: 0 auto;
      max-width: 570px;
      padding: 0;
    }

    article > :global(h2) {
      font-size: var(--font-size-5);
      padding: var(--space-2) 0 var(--space-1) 0;
    }

    article > :global(h3) {
      font-size: var(--font-size-4);
      padding: var(--space-2) 0 var(--space-1) 0;
    }

    article > :global(p) {
      font-size: var(--font-size-4);
      padding-bottom: var(--space-5);
      line-height: var(--line-height-body-d);
    }

    article > :global(blockquote) {
      font-size: var(--font-size-4);
    }

    article > :global(hr) {
      margin: var(--space-6) auto var(--space-8) auto;
    }

    article > :global(ul) {
      letter-spacing: var(--letter-spacing-wide);
      margin-left: var(--space-5);
      list-style-position: outside;
      list-style-type: disc;
    }

    article > :global(li) {
      font-size: var(--font-size-2);
      color: var(--grey-6);
      line-height: var(--line-height-3);
      letter-spacing: var(--letter-spacing-wide);
      padding-bottom: var(--space-4);
    }

    article > :global(li:last-of-type) {
      padding-bottom: var(--space-5);
    }

    /* author bottom */
    .author-bottom {
      max-width: 570px;
      margin: 0 auto var(--space-6) auto;
      padding: var(--space-5) 0;
    }

    .author-name {
      margin-left: var(--space-4);
    }

    .author-name > :nth-of-type(1) {
      font-size: var(--font-size-3);
    }

    /* share list */
    .share-list {
      max-width: 570px;
      padding: 0;
      margin: 0 auto var(--space-8) auto;
    }

    .share-icon-list {
      gap: var(--space-4);
    }

    .share-icon-list .share-icon {
      width: 35px;
    }

    .share-icon-list > svg {
      width: 24px;
    }

    .copy-tip {
      left: 145px;
    }

    /* read more */
    .read-more {
      width: 85vw;
      padding: 0 var(--space-2);
      margin: 0 auto var(--space-8) auto;
    }
    .read-more > .title {
      margin-bottom: var(--space-3);
    }

    .read-more > .articles {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    /* comment */
    .comments {
      width: 85vw;
      padding: 0 var(--space-2);
      margin: 0 auto var(--space-8) auto;
    }
    .comments > .title {
      margin-bottom: var(--space-3);
    }
  }

  @media (min-width: 1024px) {
    .read-more,
    .comments {
      width: 75vw;
      max-width: 1200px;
    }
  }
</style>

<!-- article metadata -->
<!-- weird meta closed slash auto add when autusave ... -->
<svelte:head>
  <title>{article.title} - DD Story Hub 融數基地</title>
  <link rel="canonical" href={pageUrl} />
  <meta name="description" content={article.description + article.meta_tags} />
  <meta name="author" content="ddstoryhub.com" />
  <meta property="og:title" content="{article.title} - DD Story Hub 融數基地" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content={article.cover_image} />
  <meta property="og:site_name" content="DD Story Hub 融數基地" />
  <meta property="og:description" content={article.description} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="Social" />
  <meta name="twitter:title" content="{article.title} - DD Story Hub 融數基地" />
  <meta property="twitter:description" content={article.description} />
  <meta name="twitter:image" content={article.cover_image} />
  <meta property="article:section" content={article.category} />
  {#each article.meta_tags.split(',') as tag}
    <meta property="article:tag" content={tag} />
  {/each}
  <meta property="article:published_time" content={article.published_date} />
  <meta property="article:modified_time" content={article.updated_date} />
  <meta name="pubdate" content={article.published_date} />
  <meta name="lastmod" content={article.updated_date} />
</svelte:head>

{#if article.cover_full && !$isMobile}
  <!-- full cover -->
  <div class="full-cover">
    <figure class="cover">
      <img src={article.cover_image} alt="cover" />
    </figure>
    <div class="dark-bg" />

    <div class="article-meta">
      <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(article.category)}`}
        >{article.category}</a
      >
      <h1>{article.title}</h1>
      <div class="author-date">
        By <a sveltekit:prefetch href={`../author/${author.id}`}>{author.name}</a>, {formatDate(
          Date.parse(article.published_date)
        )}
      </div>
    </div>
  </div>
  <div class="article-meta" style="margin-bottom: var(--space-8);"><blockquote>{article.description}</blockquote></div>
{:else}
  <!-- general cover -->
  <div class="article-meta">
    <a class="category" sveltekit:prefetch href={`/category/${categoryPathName(article.category)}`}
      >{article.category}</a
    >
    <h1>{article.title}</h1>
    <div class="author-date">
      By <a sveltekit:prefetch href={`../author/${author.id}`}>{author.name}</a>, {formatDate(
        Date.parse(article.published_date)
      )}
    </div>
    <blockquote>{article.description}</blockquote>
    <figure class="cover">
      <img src={article.cover_image} alt="cover" />
      <figcaption>{article.cover_image_description}</figcaption>
    </figure>
  </div>
{/if}
<!-- main article part -->
<article>
  <slot />
  <hr />
</article>
<!-- tags -->
<div class="tags">
  {#each article.tags.split(',') as tag}
    <span>#{tag}</span>
  {/each}
</div>

<!-- author info -->
<div class="author-bottom">
  <img class="author-avatar" src={`/assets/author/avatar/${author.avatar}`} alt="" />
  <div class="author-name">
    <div>作者</div>
    <div><a sveltekit:prefetch href={`../author/${author.id}`}>{author.name}</a></div>
  </div>
</div>
<!-- share icon lists (bottom) -->
<div class="share-list">
  {#key copyTipCount}
    <div class:show-copy-tip={copyTipCount !== 1} class="copy-tip">複製成功</div>
  {/key}

  <div class="share-icon-list">
    <a class="share-icon" href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 9.05025C0 13.5248 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3503 3.6 12.9998 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
          fill="#343A40"
        />
      </svg>
    </a>
    <a class="share-icon" href={`https://twitter.com/share?url=${pageUrl}`} target="_blank">
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 0.5C8.33594 0.5 0.5 8.33594 0.5 18C0.5 27.6641 8.33594 35.5 18 35.5C27.6641 35.5 35.5 27.6641 35.5 18C35.5 8.33594 27.6641 0.5 18 0.5ZM26.4102 13.6914C26.4219 13.875 26.4219 14.0664 26.4219 14.2539C26.4219 19.9883 22.0547 26.5938 14.0742 26.5938C11.6133 26.5938 9.33203 25.8789 7.41016 24.6484C7.76172 24.6875 8.09766 24.7031 8.45703 24.7031C10.4883 24.7031 12.3555 24.0156 13.8438 22.8516C11.9375 22.8125 10.3359 21.5625 9.78906 19.8438C10.457 19.9414 11.0586 19.9414 11.7461 19.7656C10.7646 19.5662 9.88232 19.0331 9.24928 18.257C8.61624 17.4808 8.27143 16.5094 8.27344 15.5078V15.4531C8.84766 15.7773 9.52344 15.9766 10.2305 16.0039C9.6361 15.6078 9.14866 15.0711 8.81137 14.4415C8.47408 13.8119 8.29736 13.1088 8.29688 12.3945C8.29688 11.5859 8.50781 10.8477 8.88672 10.207C9.97618 11.5482 11.3357 12.6451 12.8768 13.4264C14.418 14.2078 16.1063 14.6561 17.832 14.7422C17.2188 11.793 19.4219 9.40625 22.0703 9.40625C23.3203 9.40625 24.4453 9.92969 25.2383 10.7734C26.2188 10.5898 27.1562 10.2227 27.9922 9.73047C27.668 10.7344 26.9883 11.582 26.0859 12.1172C26.9609 12.0234 27.8047 11.7812 28.5859 11.4414C27.9961 12.3086 27.2578 13.0781 26.4102 13.6914Z"
          fill="#343A40"
        />
      </svg>
    </a>
    <a class="share-icon" href={`https://lineit.line.me/share/ui?url=${pageUrl}`} target="_blank">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5221 7.39743C14.5856 7.39524 14.6489 7.40586 14.7083 7.42866C14.7676 7.45146 14.8217 7.48598 14.8675 7.53015C14.9132 7.57432 14.9495 7.62724 14.9744 7.68576C14.9992 7.74428 15.012 7.8072 15.012 7.87077C15.012 7.93434 14.9992 7.99726 14.9744 8.05578C14.9495 8.1143 14.9132 8.16722 14.8675 8.2114C14.8217 8.25557 14.7676 8.29008 14.7083 8.31288C14.6489 8.33568 14.5856 8.3463 14.5221 8.34411H13.2064V9.18786H14.5221C14.586 9.18474 14.6499 9.19464 14.7098 9.21694C14.7698 9.23925 14.8246 9.27351 14.871 9.31764C14.9173 9.36177 14.9542 9.41486 14.9794 9.47367C15.0046 9.53249 15.0176 9.59581 15.0176 9.6598C15.0176 9.72379 15.0046 9.78712 14.9794 9.84593C14.9542 9.90475 14.9173 9.95783 14.871 10.002C14.8246 10.0461 14.7698 10.0804 14.7098 10.1027C14.6499 10.125 14.586 10.1349 14.5221 10.1317H12.735C12.6101 10.1313 12.4904 10.0814 12.4022 9.99295C12.314 9.90451 12.2643 9.78473 12.2642 9.6598V6.0823C12.2642 5.82186 12.4751 5.60811 12.735 5.60811H14.5254C14.6469 5.61439 14.7613 5.66715 14.8449 5.75547C14.9285 5.84379 14.975 5.96089 14.9746 6.08252C14.9743 6.20414 14.9271 6.32097 14.843 6.40879C14.7588 6.4966 14.6441 6.54869 14.5226 6.55424H13.2069V7.39799L14.5221 7.39743ZM11.6342 9.65924C11.6332 9.78452 11.5827 9.90432 11.4938 9.9926C11.4049 10.0809 11.2847 10.1305 11.1594 10.1306C11.0853 10.1313 11.0119 10.1148 10.9452 10.0823C10.8786 10.0498 10.8204 10.0022 10.7753 9.9433L8.94431 7.45311V9.65868C8.94431 9.78384 8.89459 9.90388 8.80609 9.99239C8.71758 10.0809 8.59754 10.1306 8.47237 10.1306C8.34721 10.1306 8.22717 10.0809 8.13867 9.99239C8.05016 9.90388 8.00044 9.78384 8.00044 9.65868V6.08118C8.00044 5.87924 8.13262 5.69811 8.32275 5.63343C8.3697 5.61684 8.41921 5.60865 8.469 5.60924C8.61525 5.60924 8.75025 5.68855 8.84081 5.79993L10.6864 8.29574V6.08118C10.6864 5.82074 10.8973 5.60699 11.1583 5.60699C11.4193 5.60699 11.6331 5.82074 11.6331 6.08118L11.6342 9.65924ZM7.32769 9.65924C7.32709 9.78471 7.27679 9.90483 7.18781 9.99329C7.09882 10.0817 6.97841 10.1313 6.85294 10.1312C6.7284 10.1301 6.60931 10.08 6.52157 9.9916C6.43382 9.90322 6.38452 9.78378 6.38438 9.65924V6.08174C6.38438 5.8213 6.59531 5.60755 6.85631 5.60755C7.11675 5.60755 7.32825 5.8213 7.32825 6.08174L7.32769 9.65924ZM5.47875 10.1312H3.68831C3.56298 10.1309 3.44282 10.0812 3.35393 9.9928C3.26504 9.90443 3.2146 9.78457 3.21356 9.65924V6.08174C3.21356 5.8213 3.42731 5.60755 3.68831 5.60755C3.94931 5.60755 4.16025 5.8213 4.16025 6.08174V9.1873H5.47875C5.60392 9.1873 5.72395 9.23702 5.81246 9.32553C5.90097 9.41403 5.95069 9.53407 5.95069 9.65924C5.95069 9.7844 5.90097 9.90444 5.81246 9.99295C5.72395 10.0815 5.60392 10.1312 5.47875 10.1312ZM18 7.7338C18 3.70574 13.9596 0.42749 9 0.42749C4.04044 0.42749 0 3.70574 0 7.7338C0 11.3434 3.20231 14.3668 7.52625 14.9411C7.81931 15.0024 8.21756 15.1346 8.3205 15.3838C8.41106 15.6088 8.379 15.9576 8.34975 16.1955L8.22656 16.9599C8.19112 17.1855 8.04488 17.8481 9.01181 17.4437C9.98156 17.0392 14.2003 14.3854 16.0898 12.2107C17.3818 10.7961 18 9.34255 18 7.7338Z"
          fill="#343A40"
        />
      </svg>
    </a>
    <svg on:click={handleClickCopyBtn} class="share-icon" viewBox="0 0 25 26" xmlns="http://www.w3.org/2000/svg">
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
<!-- read more -->
{#if article.read_more}
  <div class="read-more">
    <div class="title">更多文章</div>
    <div class="articles">
      {#each article.read_more as readMoreSlug}
        {#each articles.filter((d) =>
          d.slug.includes(readMoreSlug)
        ) as { cover_image, category, slug, title, description, published_date }}
          <ArticleBlock {cover_image} {category} {slug} {title} {description} {published_date} />
        {/each}
      {/each}
    </div>
  </div>
{/if}
<!-- comment -->
<div class="comments">
  <div class="title">留言區</div>
  <div id="disqus_thread" />
  <script>
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    ;(function () {
      // DON'T EDIT BELOW THIS LINE
      var d = document,
        s = d.createElement('script')
      s.src = 'https://ddstoryhub.disqus.com/embed.js'
      s.setAttribute('data-timestamp', +new Date())
      ;(d.head || d.body).appendChild(s)
    })()
  </script>
  <noscript
    >Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a
    ></noscript
  >
</div>
