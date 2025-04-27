<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-container">
	<h1>{$page.status}: {$page.error?.message || 'Page not found'}</h1>
	<p>Sorry, we couldn't find the page you're looking for.</p>
	<a href="/" class="home-link">Go back home</a>
</div>

<style>
	.error-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}

	h1 {
		margin-bottom: 1rem;
		color: var(--error);
	}

	p {
		margin-bottom: 2rem;
		color: var(--text-muted);
	}

	.home-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: var(--primary);
		color: white;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: background 0.2s;
	}

	.home-link:hover {
		background: var(--primary-dark);
	}
</style>
