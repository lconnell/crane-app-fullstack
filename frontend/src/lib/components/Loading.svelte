<script lang="ts">
  export let size: "small" | "medium" | "large" = "medium";
</script>

<div class="spinner {size}" aria-label="Loading">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>

<style>
  .spinner {
    display: inline-flex;
    gap: var(--spacing-xs);
  }

  .spinner > div {
    background-color: var(--primary);
    border-radius: 100%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .small > div {
    width: var(--text-sm);
    height: var(--text-sm);
  }

  .medium > div {
    width: var(--text-base);
    height: var(--text-base);
  }

  .large > div {
    width: var(--text-lg);
    height: var(--text-lg);
  }

  .bounce1 {
    animation-delay: -0.32s !important;
  }

  .bounce2 {
    animation-delay: -0.16s !important;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
</style>
