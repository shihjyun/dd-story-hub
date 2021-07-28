<style>
  .box-wrap {
    /* use `inline-block` to fix collapsing margins problem  */
    display: inline-block;
    width: 100%;
    font-family: 'Roboto Mono', 'Noto Sans TC';
    color: var(--grey-7);
    font-size: var(--font-size-3);
    background-color: var(--grey-2);
    padding: var(--space-3) var(--space-3);
    margin-bottom: var(--space-7);
  }

  .box-wrap > :global(p) {
    padding-bottom: var(--space-2);
  }

  .box-wrap > :global(p:last-of-type) {
    padding-bottom: 0;
  }

  @media (min-width: 768px) {
    .box-wrap {
      margin-bottom: var(--space-7);
    }
  }
</style>

<div class="box-wrap">
  <slot />
</div>
