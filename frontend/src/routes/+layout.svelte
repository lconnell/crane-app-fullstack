<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { checkAuth, currentUser } from '$lib/stores/auth';
	import Sidebar from '$lib/components/common/Sidebar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5 minutes
				retry: 1
			}
		}
	});

	onMount(async () => {
		const isAuthPage = $page.url.pathname === '/login' || $page.url.pathname === '/signup';
		if (!isAuthPage) {
			const user = await checkAuth();
			if (!user) {
				await goto('/login');
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<ErrorBoundary>
		<div class="app">
			{#if $currentUser}
				<Sidebar />
			{/if}
			<main class:with-sidebar={$currentUser}>
				<slot />
			</main>
		</div>
		<Toast />
	</ErrorBoundary>
</QueryClientProvider>

<style>
	.app {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		padding: 1rem;
	}

	.with-sidebar {
		margin-left: 300px;
	}

	@media (max-width: 768px) {
		.with-sidebar {
			margin-left: 0;
		}
	}
</style>
