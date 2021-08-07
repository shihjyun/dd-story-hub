<script>
  // your script goes here
</script>

<style>
  .toc-wrap {
    margin: var(--space-2) 0 var(--space-6) 0;
  }

  .toc {
    position: relative;
    border-top: 2px var(--grey-2) solid;
    border-bottom: 2px var(--grey-2) solid;
    padding: var(--space-6) 0 var(--space-3) 0;
  }

  .toc > span {
    top: -16px;
    position: absolute;
    font-size: var(--font-size-3);
    color: var(--grey-7);
    line-height: var(--line-height-body);
    padding-right: var(--space-4);
    background-color: var(--grey-0);
  }
  .toc > :global(ul) {
    padding-bottom: var(--space-6);
    list-style-position: outside;
    list-style-type: '・';
    font-size: var(--font-size-3);
    color: var(--grey-7);
    line-height: var(--line-height-body);
  }

  .toc > :global(ul > li) {
    margin: 0 var(--space-5) 0 var(--space-7);
  }

  @media (min-width: 768px) {
    .toc-wrap {
      margin: var(--space-2) 0 var(--space-8) 0;
    }

    .toc {
      padding: var(--space-7) 0 var(--space-5) 0;
    }

    .toc > span {
      font-size: var(--space-4);
    }

    .toc > :global(ul) {
      padding-bottom: 0;
      font-size: var(--font-size-4);
    }
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="toc-wrap">
  <div class="toc">
    <span>本篇目錄</span>
    <slot />
  </div>
</div>
