<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toast';

	let error: Error | null = null;

	onMount(() => {
		window.addEventListener('error', (event: ErrorEvent) => {
			if (event.error) {
				error = event.error;
				toastStore.error(event.error.message);
			}
		});

		window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
			error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
			toastStore.error(error.message);
		});

		return () => {
			window.removeEventListener('error', () => {});
			window.removeEventListener('unhandledrejection', () => {});
		};
	});
</script>

{#if error}
	<div class="error-boundary">
		<div class="content">
			<h2>Something went wrong</h2>
			<p>{error.message}</p>
			<button on:click={() => window.location.reload()}>Reload Page</button>
		</div>
	</div>
{:else}
	<slot />
{/if}

<style>
	.error-boundary {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 1000;
	}

	.content {
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		max-width: 400px;
		width: 100%;
		text-align: center;
	}

	h2 {
		color: var(--error);
		margin-bottom: 1rem;
	}

	p {
		color: var(--text);
		margin-bottom: 1.5rem;
	}

	button {
		background: var(--primary);
		color: white;
		border: none;
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	button:hover {
		background: var(--primary-dark);
	}
</style>
