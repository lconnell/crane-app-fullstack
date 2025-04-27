<script lang="ts">
  export let padding = true;
</script>

<div class="card" class:padding>
  <slot />
</div>

<style>
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .padding {
    padding: 1.5rem;
  }
</style>
