<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toast';

	let toasts = $toastStore;

	function removeToast(id: string) {
		toastStore.remove(id);
	}
</script>

<div class="toast-container">
	{#each toasts as toast (toast.id)}
		<div
			class="toast"
			class:success={toast.type === 'success'}
			class:error={toast.type === 'error'}
			class:info={toast.type === 'info'}
			transition:fly={{ y: 50, duration: 300 }}
		>
			<div class="content">
				<span class="message">{toast.message}</span>
				<button class="close" on:click={() => removeToast(toast.id)}>
					<X size={16} />
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 1000;
	}

	.toast {
		background: white;
		border-radius: 0.375rem;
		padding: 0.75rem 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		min-width: 300px;
		max-width: 400px;
	}

	.toast.success {
		border-left: 4px solid var(--success);
	}

	.toast.error {
		border-left: 4px solid var(--error);
	}

	.toast.info {
		border-left: 4px solid var(--primary);
	}

	.content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.message {
		font-size: 0.875rem;
		color: var(--text);
	}

	.close {
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.close:hover {
		background: var(--bg-subtle);
		color: var(--text);
	}
</style>
