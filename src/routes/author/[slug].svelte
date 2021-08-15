<script context="module">
  export async function load({ page, fetch }) {
    // get article data
    const res = await fetch(`/article.json?author=${page.params.slug}`)
    // get author infomation
    const author = await fetch('/assets/author/authors.json').then((res) => res.json())

    if (res.ok) {
      return {
        props: {
          authorSlug: page.params.slug,
          article: await res.json(),
          author: await author.filter((d) => d.id === page.params.slug)[0],
        },
      }
    }

    return {
      status: res.status,
      error: new Error(),
    }
  }
</script>

<script>
  import { fade } from 'svelte/transition'
  import ArticleBlock from '$lib/shared/ArticleBlock.svelte'
  import { isMobile } from '$lib/utils/MobileDetector.js'

  export let article, author, authorSlug

  $: selectedArticleAmount = article.length
  $: limitArticleAmount = $isMobile ? 4 : 9
  $: showLoadMoreButton = limitArticleAmount < selectedArticleAmount ? true : false

  function loadMore() {
    if (limitArticleAmount < selectedArticleAmount) {
      limitArticleAmount += $isMobile ? 4 : 6
    }
  }
</script>

<style>
  .container {
    padding: 0 var(--space-4);
    margin-bottom: var(--space-8);
  }

  .articles {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    column-gap: var(--space-5);
    row-gap: var(--space-8);
  }

  .author {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: var(--space-8) 0 var(--space-6) 0;
    padding-bottom: var(--space-8);
    border-bottom: 2px var(--grey-1) solid;
    gap: var(--space-1);
  }

  .author > p {
    font-size: var(--font-size-3);
    line-height: var(--line-height-body);
    color: var(--grey-8);
    text-align: center;
    max-width: 225px;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
    background-color: var(--grey-3);
    border-radius: 100%;
  }

  h1 {
    font-family: Roboto 'Noto Sans TC';
    font-size: var(--font-size-3);
    font-weight: 700;
    line-height: var(--line-height-body);
    color: var(--grey-8);
  }

  /* social */
  .social-icons {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .social-icon {
    fill: var(--grey-7);
  }

  .social-icon:hover {
    opacity: 0.8;
  }

  button {
    display: block;
    margin: var(--space-9) auto 0 auto;
    font-size: var(--font-size-2);
    color: var(--grey-0);
    background-color: var(--green-5);
    padding: var(--space-1) var(--space-7);
  }

  button:focus {
    outline: 0;
  }

  @media (min-width: 768px) {
    .author {
      margin: var(--space-8) 0 var(--space-8) 0;
      padding-bottom: var(--space-8);
    }

    .author-avatar {
      width: 120px;
      height: 120px;
    }

    h1 {
      font-size: var(--font-size-6);
    }

    .author > p {
      max-width: 372px;
    }

    .articles {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .container {
      padding: 0 0 var(--space-8) 0;
      width: 85vw;
      margin: 0 auto;
    }
  }

  @media (min-width: 1024px) {
    .container {
      width: 75vw;
      max-width: 1200px;
    }
  }
</style>

<svelte:head>
  <title>{author.name} - DD Story Hub 融數基地</title>
  <link rel="canonical" href="https://www.ddstoryhub.com/author/{authorSlug}" />
  <meta
    name="description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="author" content="ddstoryhub.com" />
  <meta property="og:title" content="{author.name} - DD Story Hub 融數基地" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.ddstoryhub.com/category/{authorSlug}" />
  <meta property="og:image" content="https://www.ddstoryhub.com/assets/index/DD-og-image.png" />
  <meta property="og:site_name" content="DD Story Hub 融數基地" />
  <meta
    property="og:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="Social" />
  <meta name="twitter:title" content="{author.name} - DD Story Hub 融數基地" />
  <meta
    property="twitter:description"
    content="DD Story Hub 融數基地是因為喜歡研究數位敘事及資料新聞，而聚集在一起的夥伴，期待能夠透過不同的敘事方式，放大故事影響力。"
  />
  <meta name="twitter:image" content="https://www.ddstoryhub.com/assets/index/DD-og-image.png" />
</svelte:head>

<div class="container">
  <div class="author">
    <img class="author-avatar" src={`/assets/author/avatar/${author.avatar}`} alt="avatar" />
    <h1>{author.name}</h1>
    <div class="social-icons">
      {#each author.social as s}
        {#if s['email']}
          <a class="social-icon" style="width: 21px" href={'mailto: ' + s['email']} target="_blank"
            ><svg viewBox="0 0 21 15" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.854 0H2.854C1.754 0 0.864004 0.825 0.864004 1.83333L0.854004 12.8333C0.854004 13.8417 1.754 14.6667 2.854 14.6667H18.854C19.954 14.6667 20.854 13.8417 20.854 12.8333V1.83333C20.854 0.825 19.954 0 18.854 0ZM18.854 12.8333H2.854V3.66667L10.854 8.25L18.854 3.66667V12.8333ZM10.854 6.41667L2.854 1.83333H18.854L10.854 6.41667Z"
              />
            </svg></a
          >
        {:else if s['linkedin']}
          <a class="social-icon" style="width: 18px" href={s['linkedin']} target="_blank">
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.22594e-07 1.50382C2.22594e-07 1.10498 0.158438 0.722481 0.440458 0.44046C0.722479 0.158439 1.10498 2.0048e-06 1.50382 2.0048e-06H16.4945C16.6922 -0.00032081 16.888 0.0383444 17.0707 0.113784C17.2533 0.189223 17.4194 0.299955 17.5592 0.439641C17.699 0.579326 17.81 0.745221 17.8856 0.927828C17.9612 1.11044 18.0001 1.30617 18 1.50382V16.4945C18.0002 16.6922 17.9614 16.888 17.8859 17.0707C17.8104 17.2534 17.6996 17.4194 17.5598 17.5593C17.4201 17.6991 17.2541 17.81 17.0715 17.8856C16.8888 17.9612 16.6931 18.0001 16.4954 18H1.50382C1.30627 18 1.11065 17.9611 0.928143 17.8855C0.745638 17.8098 0.579822 17.699 0.440169 17.5593C0.300516 17.4195 0.189762 17.2536 0.114237 17.0711C0.0387109 16.8886 -0.00010726 16.6929 2.22594e-07 16.4954V1.50382ZM7.12473 6.86291H9.56209V8.08691C9.91391 7.38327 10.8139 6.75 12.1664 6.75C14.7592 6.75 15.3736 8.15155 15.3736 10.7231V15.4865H12.7497V11.3089C12.7497 9.84437 12.3979 9.018 11.5045 9.018C10.2649 9.018 9.74945 9.909 9.74945 11.3089V15.4865H7.12473V6.86291ZM2.62473 15.3745H5.24945V6.75H2.62473V15.3736V15.3745ZM5.625 3.93709C5.62995 4.16182 5.58996 4.38528 5.50738 4.59435C5.4248 4.80342 5.30129 4.99389 5.1441 5.15457C4.98691 5.31526 4.79921 5.44293 4.59201 5.5301C4.38481 5.61726 4.16229 5.66216 3.9375 5.66216C3.71271 5.66216 3.49019 5.61726 3.28299 5.5301C3.07579 5.44293 2.88809 5.31526 2.7309 5.15457C2.57371 4.99389 2.4502 4.80342 2.36762 4.59435C2.28504 4.38528 2.24505 4.16182 2.25 3.93709C2.25971 3.49597 2.44177 3.07619 2.75718 2.76765C3.07259 2.45911 3.49627 2.28634 3.9375 2.28634C4.37873 2.28634 4.80241 2.45911 5.11782 2.76765C5.43323 3.07619 5.61529 3.49597 5.625 3.93709Z"
              />
            </svg>
          </a>
        {:else if s['facebook']}
          <a class="social-icon" style="width: 18px" href={s['facebook']} target="_blank">
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 9.05025C0 13.5247 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3502 3.6 12.9997 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
              />
            </svg>
          </a>
        {:else if s['twitter']}
          <a class="social-icon" style="width: 19px" href={s['twitter']} target="_blank"
            ><svg viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.14575 0C4.17566 0 0.145752 4.02991 0.145752 9C0.145752 13.9701 4.17566 18 9.14575 18C14.1158 18 18.1458 13.9701 18.1458 9C18.1458 4.02991 14.1158 0 9.14575 0ZM13.471 6.78415C13.477 6.87857 13.477 6.97701 13.477 7.07344C13.477 10.0225 11.231 13.4196 7.12678 13.4196C5.86115 13.4196 4.68794 13.052 3.69955 12.4192C3.88035 12.4393 4.05312 12.4473 4.23794 12.4473C5.28258 12.4473 6.24285 12.0938 7.00825 11.4951C6.02789 11.475 5.20423 10.8321 4.92298 9.94821C5.26651 9.99844 5.57589 9.99844 5.92946 9.90804C5.42467 9.80548 4.97095 9.53133 4.64538 9.13215C4.31982 8.73298 4.14249 8.23341 4.14352 7.7183V7.69018C4.43883 7.85692 4.78638 7.95937 5.14999 7.97344C4.84432 7.76972 4.59364 7.49373 4.42017 7.16993C4.24671 6.84613 4.15582 6.48452 4.15557 6.11719C4.15557 5.70134 4.26406 5.32165 4.45892 4.99219C5.01922 5.68193 5.71838 6.24604 6.51097 6.64788C7.30356 7.04971 8.17184 7.28026 9.05937 7.32455C8.74397 5.80781 9.877 4.58036 11.2391 4.58036C11.8819 4.58036 12.4605 4.84955 12.8683 5.28348C13.3725 5.18906 13.8547 5.00022 14.2846 4.7471C14.1178 5.26339 13.7683 5.69933 13.3042 5.97455C13.7542 5.92634 14.1882 5.80179 14.5899 5.62701C14.2866 6.07299 13.9069 6.46875 13.471 6.78415Z"
              />
            </svg>
          </a>
        {:else if s['website']}
          <a class="social-icon" style="width: 18px" href={s['website']} target="_blank">
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.1259 0.00083619C4.0645 -0.0675228 -0.067526 4.0643 0.00083623 9.12546C0.0683331 13.9794 4.0208 17.9316 8.87495 17.9991C13.9372 18.0684 18.0684 13.9365 17.9991 8.87539C17.9325 4.0206 13.98 0.0683298 9.1259 0.00083619ZM14.5957 14.1594C14.5785 14.178 14.5574 14.1926 14.5339 14.2022C14.5103 14.2117 14.485 14.216 14.4597 14.2147C14.4343 14.2134 14.4096 14.2065 14.3872 14.1945C14.3648 14.1826 14.3453 14.1658 14.3301 14.1455C13.9431 13.6392 13.4691 13.2057 12.9304 12.8653C11.8288 12.1583 10.433 11.769 9.00042 11.769C7.56784 11.769 6.17204 12.1583 5.07046 12.8653C4.53173 13.2056 4.05779 13.6389 3.67076 14.1451C3.65556 14.1654 3.63607 14.1821 3.61367 14.1941C3.59128 14.2061 3.56653 14.2129 3.54118 14.2143C3.51583 14.2156 3.49049 14.2113 3.46698 14.2017C3.44346 14.1922 3.42234 14.1776 3.4051 14.1589C2.1355 12.7884 1.41632 10.9977 1.38539 9.12979C1.31486 4.91965 4.76975 1.3957 8.98182 1.38532C13.1939 1.37494 16.6155 4.79505 16.6155 8.99999C16.6169 10.9129 15.8955 12.7558 14.5957 14.1594Z"
              />
              <path
                d="M8.99906 4.15479C8.14583 4.15479 7.37437 4.47451 6.82618 5.05557C6.27798 5.63662 6.0041 6.44005 6.06597 7.30232C6.19145 9.00048 7.5072 10.385 8.99906 10.385C10.4909 10.385 11.8041 9.00048 11.9321 7.30275C11.9962 6.4487 11.7245 5.65262 11.1672 5.06076C10.6168 4.47668 9.84666 4.15479 8.99906 4.15479Z"
              />
            </svg>
          </a>
        {/if}
      {/each}
    </div>
    <p>{author.bio}</p>
  </div>
  <div in:fade class="articles">
    {#each article.slice(0, limitArticleAmount) as { cover_image, slug, category, title, description, published_date }}
      <ArticleBlock {cover_image} {slug} {title} {category} {description} {published_date} />
    {/each}
  </div>
  {#if showLoadMoreButton}
    <button on:click={loadMore}>載入更多</button>
  {/if}
</div>
