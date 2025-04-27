<script lang="ts">
	import { currentUser } from '$lib/stores/auth';
</script>

<div class="container">
	<h1>Settings</h1>
	{#if $currentUser}
		<p>Welcome to the settings page, {$currentUser.email}!</p>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 1rem;
		color: var(--primary);
	}
</style>
