<script lang="ts">
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';
	import SidebarItems from './SidebarItems.svelte';
	import { currentUser } from '$lib/stores/auth';

	let isOpen = false;

	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<aside class="sidebar" class:open={isOpen}>
	<div class="header">
		<button class="toggle" on:click={toggleSidebar}>
			{#if isOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
		<h1>Work Order App</h1>
	</div>
	<SidebarItems />
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 300px;
		background: var(--bg);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		transform: translateX(-100%);
		transition: transform 0.3s ease-in-out;
		z-index: 100;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.header {
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
	}

	.toggle {
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		color: var(--text);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	.toggle:hover {
		background: var(--bg-subtle);
	}

	h1 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	@media (min-width: 768px) {
		.sidebar {
			transform: translateX(0);
		}

		.toggle {
			display: none;
		}
	}
</style>
