<script>
</script>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 15vh;
    background-color: var(--green-200);
    margin-top: 4rem;
  }

  p {
    font-size: var(--text-sm);
    color: rgb(39, 39, 39);
    text-align: center;
    letter-spacing: 0.025em;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }
  a {
    margin: 0 0.75rem;
  }
  svg {
    width: 24px;
    fill: var(--gray-500);
    transition: fill 0.15s linear;
  }

  svg:hover {
    fill: var(--green-600);
  }

  @media (min-width: 650px) {
    div {
      margin-top: 1rem;
    }
  }
</style>

<footer>
  <p>©2021 融數基地 DD Story Hub</p>
  <div>
    <a href="https://medium.com/dd-story-hub" target="_blank"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1770 1000">
        <circle cx="500" cy="500" r="500" />
        <ellipse ry="475" rx="250" cy="501" cx="1296" />
        <ellipse cx="1682" cy="502" rx="88" ry="424" />
      </svg></a
    >
  </div>
</footer>
