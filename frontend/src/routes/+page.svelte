<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores/auth';
</script>

<div class="container">
    <h1>Welcome to Work Order App</h1>
    {#if $currentUser}
        <p>Hello, {$currentUser.email}!</p>
    {:else}
        <p>Please log in to continue.</p>
        <a href="/login" class="login-link">Login</a>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    h1 {
        margin-bottom: 1rem;
        color: var(--primary);
    }

    .login-link {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 0.375rem;
        transition: background 0.2s;
    }

    .login-link:hover {
        background: var(--primary-dark);
    }
</style>
