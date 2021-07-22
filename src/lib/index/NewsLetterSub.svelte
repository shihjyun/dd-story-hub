<script>
  // your script goes here
</script>

<style>
  .news-sub {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    background-color: var(--green-6);
    padding: var(--space-4);
  }

  .news-sub > span {
    color: var(--grey-1);
    font-size: var(--font-size-5);
    font-weight: 300;
    padding-bottom: var(--space-4);
  }

  .input-wrap {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr;
  }

  .mail-input {
    font-size: var(--font-size-4);
    font-family: Roboto;
    height: 46px;
    outline: 0;
    padding: var(--space-1) var(--space-3);
  }

  .mail-input:focus {
    border-color: none;
  }

  button {
    font-size: var(--font-size-5);
    background-color: var(--grey-1);
    color: var(--grey-7);
    font-family: Roboto;
    transition: color 0.15s linear;
    padding: var(--space-1) 0;
  }

  button:focus {
    outline: 0;
  }

  button:hover {
    background-color: var(--grey-2);
  }

  @media (min-width: 768px) {
    .news-sub {
      flex-direction: row;
      align-items: center;
      padding: 0 var(--space-4);
      height: 80px;
    }

    .news-sub > span {
      padding-bottom: 0;
    }

    .input-wrap {
      width: 45%;
      grid-template-columns: 0.82fr 0.18fr;
      margin-left: var(--space-5);
    }

    .mail-input {
      padding: var(--space-1);
    }

    button {
      padding: 0;
    }
  }

  @media (min-width: 1024px) {
  }
</style>

<div class="news-sub">
  <span>訂閱我們最新的故事吧！</span>
  <div class="input-wrap">
    <input
      class="mail-input"
      aria-label="email"
      aria-required="true"
      type="email"
      data-inputmask=""
      name="fields[email]"
      placeholder="ddstoryhub@mail.com"
      autocomplete="email"
      aria-invalid="false"
    />
    <button>送出</button>
  </div>
</div>
