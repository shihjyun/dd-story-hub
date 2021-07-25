<style>
  .box-wrap {
    /* use `inline-block` to fix collapsing margins problem  */
    display: inline-block;
    width: 100%;
    font-family: 'Roboto Mono', 'Noto Sans TC';
    color: var(--grey-7);
    font-size: var(--font-size-1);
    background-color: var(--grey-2);
    padding: var(--space-2) var(--space-1);
    margin-bottom: var(--space-4);
  }

  .box-wrap > :global(p) {
    padding-bottom: var(--space-4);
  }

  .box-wrap > :global(p:last-of-type) {
    padding-bottom: 0;
  }
</style>

<div class="box-wrap">
  <slot />
</div>
