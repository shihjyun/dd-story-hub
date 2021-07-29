<script>
  let email
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

  form {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr;
  }

  .mail-input {
    font-size: var(--font-size-4);
    height: 46px;
    outline: 0;
    padding: var(--space-1) var(--space-3);
  }

  .mail-input:focus {
    border-color: none;
  }

  input[type='submit'] {
    font-size: var(--font-size-5);
    background-color: var(--grey-1);
    color: var(--green-6);
    font-family: Roboto;
    transition: color 0.15s linear;
    padding: var(--space-1) 0;
    cursor: pointer;
  }

  input[type='submit']:focus {
    outline: 0;
  }

  input:disabled {
    color: var(--grey-4);
    cursor: no-drop;
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

    form {
      width: 45%;
      grid-template-columns: 0.82fr 0.18fr;
      margin-left: var(--space-5);
    }

    .mail-input {
      padding: var(--space-1);
    }

    input[type='submit'] {
      padding: 0;
    }
  }

  @media (min-width: 1024px) {
  }
</style>

<div class="news-sub">
  <span>訂閱我們最新的故事吧！</span>
  <form
    action="https://buttondown.email/api/emails/embed-subscribe/ddstoryhub"
    method="post"
    target="popupwindow"
    onsubmit="window.open('https://buttondown.email/ddstoryhub', 'popupwindow')"
    class="embeddable-buttondown-form"
  >
    <input
      class="mail-input"
      type="email"
      name="email"
      placeholder="ddstoryhub@mail.com"
      aria-label="email address"
      bind:value={email}
    />
    <input type="submit" value="送出" disabled={!email} />
    <input type="hidden" value="1" name="embed" />
  </form>
</div>
