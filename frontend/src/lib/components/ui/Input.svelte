<script lang="ts">
	export let type: "text" | "password" | "email" | "number" = "text";
	export let label: string | undefined = undefined;
	export let placeholder = "";
	export let value: string | number = "";
	export let error: string | undefined = undefined;
	export let disabled = false;
	export let required = false;
	export let name = "";
	export let autocomplete: 'on' | 'off' | 'name' | 'email' | 'username' | 'current-password' | 'new-password' | 'one-time-code' | 'organization-title' | 'organization' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'language' | 'bday' | 'sex' | 'tel' | 'tel-country-code' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'url' | 'photo' | undefined = undefined;
</script>

<div class="input-wrapper">
	{#if label}
		<label for={name}>
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}
	<input
		{type}
		{name}
		{placeholder}
		{autocomplete}
		bind:value
		{disabled}
		{required}
		class:error={!!error}
		on:input
		on:change
		on:focus
		on:blur
		class="input"
	/>
	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		width: 100%;
	}

	label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text);
	}

	.required {
		color: var(--error);
		margin-left: var(--spacing-xs);
	}

	.input {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: var(--text-base);
		line-height: 1.5;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-light);
	}

	.input:disabled {
		background-color: var(--bg-light);
		cursor: not-allowed;
	}

	.input::placeholder {
		color: var(--text-lighter);
	}

	input.error {
		border-color: var(--error);
	}

	input.error:focus {
		box-shadow: 0 0 0 2px var(--error-light);
	}

	.error-message {
		font-size: var(--text-sm);
		color: var(--error);
	}
</style>
