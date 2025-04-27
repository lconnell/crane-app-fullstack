<script lang="ts">
	import { goto } from '$app/navigation';
	import { login, authError } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	$: if ($authError) {
		error = $authError;
	}

	async function handleLogin() {
		// Don't proceed if already loading
		if (loading) return;

		// Don't proceed if fields are empty
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		loading = true;
		error = '';

		try {
			console.log('Attempting login with:', { email, password });
			await login(email, password);
			console.log('Login successful, redirecting to home');
			await goto('/');
		} catch (e) {
			console.error('Login error:', e);
			error = e instanceof Error ? e.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="login-container">
	<div class="login-box">
		<h1>Login</h1>
		<div class="form-container">
			<Input
				type="email"
				name="username"
				label="Email"
				bind:value={email}
				required
				autocomplete="email"
			/>
			<Input
				type="password"
				name="password"
				label="Password"
				bind:value={password}
				required
				autocomplete="current-password"
			/>
			{#if error}
				<div class="error">{error}</div>
			{/if}
			<Button type="button" on:click={handleLogin} loading={loading} disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</Button>
		</div>
		<div class="links">
			<a href="/signup">Create an account</a>
			<a href="/recover-password">Forgot password?</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
		background: var(--bg-subtle);
	}

	.login-box {
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.error {
		color: var(--error);
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

	.links {
		margin-top: 1rem;
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
	}

	.links a {
		color: var(--primary);
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>
