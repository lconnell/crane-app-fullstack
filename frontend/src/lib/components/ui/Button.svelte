<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button";
	export let variant: "primary" | "secondary" | "danger" = "primary";
	export let disabled = false;
	export let loading = false;
</script>

<button
	{type}
	class="button {variant}"
	{disabled}
	class:loading
	on:click
>
	<slot />
</button>

<style>
	.button {
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		border: none;
		transition: background-color 0.2s;
	}

	.primary {
		background-color: var(--primary);
		color: var(--bg);
	}

	.secondary {
		background-color: var(--secondary);
		color: var(--text);
	}

	.danger {
		background-color: var(--danger);
		color: var(--bg);
	}

	.button:hover:not(:disabled) {
		opacity: 0.9;
	}

	.button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading {
		position: relative;
		color: transparent;
	}

	.loading::after {
		content: "";
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1rem;
		height: 1rem;
		border: 2px solid currentColor;
		border-radius: 50%;
		border-right-color: transparent;
		animation: spin 0.75s linear infinite;
	}

	@keyframes spin {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
