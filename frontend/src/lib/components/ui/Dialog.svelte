<script lang="ts">
  export let open = false;
  export let title = "";

  function closeDialog() {
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDialog();
    }
  }
</script>

{#if open}
  <dialog
    class="dialog"
    open
    aria-labelledby="dialog-title"
    on:keydown={handleKeydown}
  >
    <div class="dialog-content">
      <div class="header">
        <h2 id="dialog-title">{title}</h2>
        <button
          type="button"
          class="close"
          on:click={closeDialog}
          aria-label="Close dialog"
        >×</button>
      </div>
      <div class="content">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>

  <!-- Backdrop -->
  <button
    type="button"
    class="backdrop"
    on:click={closeDialog}
    on:keydown={handleKeydown}
    aria-label="Close dialog overlay"
  ></button>
{/if}

<style>
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    border: none;
    padding: 0;
    margin: 0;
    z-index: calc(var(--z-modal) + 1);
  }

  .dialog::backdrop {
    display: none;
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal);
    border: none;
    padding: 0;
    margin: 0;
    cursor: default;
  }

  .dialog-content {
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--border);
  }

  .header h2 {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
  }

  .close {
    background: none;
    border: none;
    font-size: var(--text-2xl);
    cursor: pointer;
    padding: var(--spacing-xs);
    color: var(--text-light);
  }

  .close:hover {
    color: var(--text);
  }

  .content {
    padding: var(--spacing-lg);
  }

  .footer {
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }
</style>
