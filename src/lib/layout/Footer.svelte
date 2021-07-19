<script>
</script>

<style>
  /* foonter content */
  .content {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    background-color: var(--grey-0);
  }

  .foot-nav {
    display: flex;
    justify-content: space-between;
  }

  .title {
    color: var(--grey-7);
  }

  .social-icon {
    display: flex;
    align-items: center;
  }

  .social-icon > a:nth-of-type(2) {
    margin: 0 var(--space-1);
  }

  li {
    color: var(--grey-5);
    transition: color 0.15s linear;
  }

  li:hover {
    color: var(--grey-4);
  }

  svg {
    fill: var(--grey-5);
    width: 18px;
    transition: color 0.15s linear;
  }

  svg:hover {
    fill: var(--grey-4);
  }

  /* copyright */

  .copyright {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 34px;
    background-color: var(--green-5);
    font-size: var(--text-sm);
    color: var(--green-6);
  }

  .copyright > p {
    font-family: Roboto;
    letter-spacing: var(--letter-spacing-wide);
    margin: 0 auto;
    width: 75vw;
    font-size: var(--font-size-0);
    color: var(--grey-0);
  }

  @media (min-width: 768px) {
    .content {
      width: 75vw;
      padding: var(--space-8) 0;
    }

    .title {
      font-size: var(--font-size-5);
      margin-bottom: var(--space-5);
    }

    .about {
      margin-left: var(--space-10);
    }

    li {
      font-size: 14px;
      margin-bottom: var(--space-0);
    }

    .logo > img {
      width: 204px;
      margin-bottom: var(--space-4);
    }
  }
</style>

<footer>
  <div class="content">
    <div class="foot-nav">
      <div class="category">
        <div class="title">分類文章</div>
        <ul>
          <li><a href="/1212">小分類一</a></li>
          <li><a href="/1212">小分類二</a></li>
          <li><a href="/1212">小分類三</a></li>
          <li><a href="/1212">小分類四</a></li>
        </ul>
      </div>
      <div class="about">
        <div class="title">關於我們</div>
        <div class="social-icon">
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
          <a href="ddemail@mail.com">
            <svg viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.3333 0.666748H2.66666C1.65833 0.666748 0.842495 1.49175 0.842495 2.50008L0.833328 13.5001C0.833328 14.5084 1.65833 15.3334 2.66666 15.3334H17.3333C18.3417 15.3334 19.1667 14.5084 19.1667 13.5001V2.50008C19.1667 1.49175 18.3417 0.666748 17.3333 0.666748ZM17.3333 13.5001H2.66666V4.33341L10 8.91675L17.3333 4.33341V13.5001ZM10 7.08341L2.66666 2.50008H17.3333L10 7.08341Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="logo">
      <img src="/assets/index/DD-regular-logo-text.svg" alt="dd-logo" />
      <div class="title">在數位時代，我們如何說好故事？</div>
    </div>
  </div>
  <div class="copyright"><p>©2021 DD Story Hub</p></div>
</footer>
