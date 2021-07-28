<script context="module">
  export async function load({ page, fetch }) {
    // get article data
    const res = await fetch(`/article.json?author=${page.params.slug}`)
    // get author infomation
    const author = await fetch('/assets/author/authors.json').then((res) => res.json())

    if (res.ok) {
      return {
        props: {
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
  import { categoryPathName } from '$lib/utils/utils'

  export let article, author
  console.log(author)

  $: selectedArticleAmount = article.length
  let limitArticleAmount = 5
  $: showLoadMoreButton = limitArticleAmount < selectedArticleAmount ? true : false

  function loadMore() {
    if (limitArticleAmount < selectedArticleAmount) {
      limitArticleAmount += 4
    }
  }

  console.log(article)
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
    font-family: Roboto;
    font-size: var(--font-size-3);
    font-weight: 700;
    line-height: var(--line-height-body);
    color: var(--grey-8);
  }

  /* social */
  .social-icons {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .social-icon {
    width: 20px;
    fill: var(--grey-7);
  }
</style>

<div class="container">
  <div class="author">
    <img class="author-avatar" src={`/assets/author/avatar/${author.avatar}`} alt="avatar" />
    <h1>{author.name}</h1>
    <div class="social-icons">
      {#each author.social as social}
        {#if social['email']}
          <a href={'mailto: ' + social['email']} target="_blank"
            ><svg class="social-icon" viewBox="0 0 21 15" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.854 0H2.854C1.754 0 0.864004 0.825 0.864004 1.83333L0.854004 12.8333C0.854004 13.8417 1.754 14.6667 2.854 14.6667H18.854C19.954 14.6667 20.854 13.8417 20.854 12.8333V1.83333C20.854 0.825 19.954 0 18.854 0ZM18.854 12.8333H2.854V3.66667L10.854 8.25L18.854 3.66667V12.8333ZM10.854 6.41667L2.854 1.83333H18.854L10.854 6.41667Z"
              />
            </svg></a
          >
        {:else if social['facebook']}
          <a href={social['facebook']} target="_blank">
            <svg class="social-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 9.05025C0 13.5247 3.24975 17.2455 7.5 18V11.4998H5.25V9H7.5V6.99975C7.5 4.74975 8.94975 3.50025 11.0002 3.50025C11.6497 3.50025 12.3502 3.6 12.9997 3.69975V6H11.85C10.7498 6 10.5 6.54975 10.5 7.25025V9H12.9L12.5002 11.4998H10.5V18C14.7502 17.2455 18 13.5255 18 9.05025C18 4.0725 13.95 0 9 0C4.05 0 0 4.0725 0 9.05025Z"
              />
            </svg>
          </a>
        {:else if social['twitter']}
          <a href={social['twitter']} target="_blank"
            ><svg class="social-icon" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.14575 0C4.17566 0 0.145752 4.02991 0.145752 9C0.145752 13.9701 4.17566 18 9.14575 18C14.1158 18 18.1458 13.9701 18.1458 9C18.1458 4.02991 14.1158 0 9.14575 0ZM13.471 6.78415C13.477 6.87857 13.477 6.97701 13.477 7.07344C13.477 10.0225 11.231 13.4196 7.12678 13.4196C5.86115 13.4196 4.68794 13.052 3.69955 12.4192C3.88035 12.4393 4.05312 12.4473 4.23794 12.4473C5.28258 12.4473 6.24285 12.0938 7.00825 11.4951C6.02789 11.475 5.20423 10.8321 4.92298 9.94821C5.26651 9.99844 5.57589 9.99844 5.92946 9.90804C5.42467 9.80548 4.97095 9.53133 4.64538 9.13215C4.31982 8.73298 4.14249 8.23341 4.14352 7.7183V7.69018C4.43883 7.85692 4.78638 7.95937 5.14999 7.97344C4.84432 7.76972 4.59364 7.49373 4.42017 7.16993C4.24671 6.84613 4.15582 6.48452 4.15557 6.11719C4.15557 5.70134 4.26406 5.32165 4.45892 4.99219C5.01922 5.68193 5.71838 6.24604 6.51097 6.64788C7.30356 7.04971 8.17184 7.28026 9.05937 7.32455C8.74397 5.80781 9.877 4.58036 11.2391 4.58036C11.8819 4.58036 12.4605 4.84955 12.8683 5.28348C13.3725 5.18906 13.8547 5.00022 14.2846 4.7471C14.1178 5.26339 13.7683 5.69933 13.3042 5.97455C13.7542 5.92634 14.1882 5.80179 14.5899 5.62701C14.2866 6.07299 13.9069 6.46875 13.471 6.78415Z"
              />
            </svg>
          </a>
        {:else if social['website']}
          <a href={social['website']} target="_blank">tmp</a>
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
