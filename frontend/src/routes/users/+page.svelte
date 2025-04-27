<script lang="ts">
	import { currentUser } from '$lib/stores/auth';
	import { getUsers, updateUser, deleteUser } from '$lib/client';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let users: any[] = [];
	let loading = true;
	let error: string | null = null;
	let totalUsers = 0;
	let currentPage = 1;
	let usersPerPage = 10;
	let sortBy = 'created_at';
	let sortOrder: 'asc' | 'desc' = 'desc';

	// Form state
	let showForm = false;
	let editingUser: any = null;
	let formData = {
		email: '',
		full_name: '',
		is_active: true,
		is_superuser: false
	};

	function formatDate(dateString: string): string {
		if (!dateString) return 'N/A';
		try {
			// Handle ISO format dates from the API
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				// If the date is invalid, try parsing it as a timestamp
				const timestamp = parseInt(dateString);
				if (!isNaN(timestamp)) {
					return new Date(timestamp).toLocaleDateString();
				}
				return 'Invalid Date';
			}
			return date.toLocaleDateString();
		} catch (e) {
			console.error('Error formatting date:', e);
			return 'Invalid Date';
		}
	}

	$: if ($currentUser && !$currentUser.is_superuser) {
		goto('/');
	}

	async function loadUsers() {
		loading = true;
		try {
			const response = await getUsers({
				skip: (currentPage - 1) * usersPerPage,
				limit: usersPerPage,
				sort_by: sortBy,
				sort_order: sortOrder
			});
			users = response.data;
			totalUsers = response.count;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load users';
		} finally {
			loading = false;
		}
	}

	function handleSort(column: string) {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
		loadUsers();
	}

	function openEditForm(user: any) {
		editingUser = user;
		formData = {
			email: user.email,
			full_name: user.full_name,
			is_active: user.is_active,
			is_superuser: user.is_superuser
		};
		showForm = true;
	}

	async function handleSubmit() {
		try {
			await updateUser(editingUser.id, formData);
			showForm = false;
			loadUsers();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update user';
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;
		try {
			await deleteUser(id);
			loadUsers();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to delete user';
		}
	}

	$: totalPages = Math.ceil(totalUsers / usersPerPage);
	$: if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

	onMount(loadUsers);
</script>

<div class="container">
	<div class="header">
		<h1>Users</h1>
	</div>

	{#if $currentUser?.is_superuser}
		<p>Welcome to the users management page, {$currentUser.email}!</p>
	{/if}

	{#if loading}
		<p>Loading users...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if users.length === 0}
		<p>No users found.</p>
	{:else}
		<div class="users-table">
			<table>
				<thead>
					<tr>
						<th on:click={() => handleSort('email')}>
							Email {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('full_name')}>
							Full Name {sortBy === 'full_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('is_active')}>
							Status {sortBy === 'is_active' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('is_superuser')}>
							Role {sortBy === 'is_superuser' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('created_at')}>
							Created {sortBy === 'created_at' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user}
						<tr>
							<td>{user.email}</td>
							<td>{user.full_name}</td>
							<td>{user.is_active ? 'Active' : 'Inactive'}</td>
							<td>{user.is_superuser ? 'Admin' : 'User'}</td>
							<td>{formatDate(user.created_at)}</td>
							<td class="actions">
								<button class="btn small" on:click={() => openEditForm(user)}>Edit</button>
								{#if user.id !== $currentUser?.id}
									<button class="btn small danger" on:click={() => handleDelete(user.id)}>Delete</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="pagination">
			<button
				class="btn"
				disabled={currentPage === 1}
				on:click={() => {
					currentPage--;
					loadUsers();
				}}
			>
				Previous
			</button>
			<span>Page {currentPage} of {totalPages}</span>
			<button
				class="btn"
				disabled={currentPage === totalPages}
				on:click={() => {
					currentPage++;
					loadUsers();
				}}
			>
				Next
			</button>
		</div>
	{/if}
</div>

{#if showForm}
	<div class="modal">
		<div class="modal-content">
			<h2>Edit User</h2>
			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" bind:value={formData.email} required />
				</div>
				<div class="form-group">
					<label for="full_name">Full Name</label>
					<input type="text" id="full_name" bind:value={formData.full_name} required />
				</div>
				<div class="form-group">
					<label for="is_active">Status</label>
					<select id="is_active" bind:value={formData.is_active}>
						<option value={true}>Active</option>
						<option value={false}>Inactive</option>
					</select>
				</div>
				<div class="form-group">
					<label for="is_superuser">Role</label>
					<select id="is_superuser" bind:value={formData.is_superuser}>
						<option value={false}>User</option>
						<option value={true}>Admin</option>
					</select>
				</div>
				<div class="form-actions">
					<button type="button" class="btn" on:click={() => (showForm = false)}>Cancel</button>
					<button type="submit" class="btn primary">Save</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0;
		color: var(--primary);
	}

	.error {
		color: red;
		margin: 1rem 0;
	}

	.users-table {
		margin-bottom: 2rem;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	th, td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	th {
		background: #f5f5f5;
		font-weight: 600;
		color: var(--primary);
		cursor: pointer;
	}

	th:hover {
		background: #eee;
	}

	tr:hover {
		background: #f9f9f9;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		background: #f0f0f0;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn:hover {
		background: #e0e0e0;
	}

	.btn.primary {
		background: var(--primary);
		color: white;
	}

	.btn.primary:hover {
		background: var(--primary-dark);
	}

	.btn.danger {
		background: #dc3545;
		color: white;
	}

	.btn.danger:hover {
		background: #c82333;
	}

	.btn.small {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}
</style>
