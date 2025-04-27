<script lang="ts">
  export let checked = false;
  export let disabled = false;
  export let label = "";
</script>

<label class="checkbox-container" class:disabled>
  <input
    type="checkbox"
    bind:checked
    {disabled}
    on:change
  />
  <span class="checkmark"></span>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</label>

<style>
  .checkbox-container {
    display: inline-flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-container.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    height: var(--text-xl);
    width: var(--text-xl);
    background-color: var(--bg);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    transition: all 0.2s;
  }

  input[type="checkbox"]:checked ~ .checkmark {
    background-color: var(--primary);
    border-color: var(--primary);
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 0.4rem;
    top: 0.2rem;
    width: 0.25rem;
    height: 0.5rem;
    border: solid var(--bg);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input[type="checkbox"]:checked ~ .checkmark:after {
    display: block;
  }

  .label {
    margin-left: var(--spacing-sm);
    font-size: var(--text-base);
    color: var(--text);
  }
</style>
