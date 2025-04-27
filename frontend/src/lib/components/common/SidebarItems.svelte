<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Home, ClipboardList, Users, Settings, LogOut } from 'lucide-svelte';
	import { currentUser, useAuth } from '$lib/stores/auth';

	const items = [
		{ icon: Home, title: 'Dashboard', path: '/' },
		{ icon: ClipboardList, title: 'Work Orders', path: '/work-orders' },
		{ icon: Users, title: 'Users', path: '/users' },
		{ icon: Settings, title: 'Settings', path: '/settings' }
	];

	$: isAdmin = $currentUser?.is_superuser ?? false;
	const { logout } = useAuth();

	async function handleNavigation(path: string) {
		await goto(path);
	}
</script>

<nav class="nav">
	<ul>
		{#each items as item}
			<li>
				<button
					class:active={$page.url.pathname === item.path}
					class:admin-only={item.path === '/users' && !isAdmin}
					on:click={() => handleNavigation(item.path)}
				>
					<svelte:component this={item.icon} size={20} />
					<span>{item.title}</span>
				</button>
			</li>
		{/each}
		<li class="logout">
			<button on:click={logout}>
				<LogOut size={20} />
				<span>Logout</span>
			</button>
		</li>
	</ul>
</nav>

<style>
	.nav {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	li {
		margin: 0;
	}

	.logout {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		color: var(--text);
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s;
		width: 100%;
		background: none;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background: var(--bg-subtle);
	}

	button.active {
		background: var(--primary-light);
		color: var(--primary);
	}

	button.admin-only {
		display: none;
	}
</style>
