<script lang="ts">
	import { currentUser } from '$lib/stores/auth';
	import { getItems, createItem, updateItem, deleteItem } from '$lib/client';
	import { onMount } from 'svelte';

	let items: any[] = [];
	let loading = true;
	let error: string | null = null;
	let totalItems = 0;
	let currentPage = 1;
	let itemsPerPage = 10;
	let sortBy = 'created_at';
	let sortOrder: 'asc' | 'desc' = 'desc';

	// Form state
	let showForm = false;
	let editingItem: any = null;
	let formData = {
		title: '',
		description: '',
		status: 'pending'
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

	async function loadItems() {
		loading = true;
		try {
			const response = await getItems({
				skip: (currentPage - 1) * itemsPerPage,
				limit: itemsPerPage,
				sort_by: sortBy,
				sort_order: sortOrder
			});
			items = response.data;
			totalItems = response.count;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load items';
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
		loadItems();
	}

	function openCreateForm() {
		editingItem = null;
		formData = {
			title: '',
			description: '',
			status: 'pending'
		};
		showForm = true;
	}

	function openEditForm(item: any) {
		editingItem = item;
		formData = {
			title: item.title,
			description: item.description,
			status: item.status
		};
		showForm = true;
	}

	async function handleSubmit() {
		try {
			if (editingItem) {
				await updateItem(editingItem.id, formData);
			} else {
				await createItem(formData);
			}
			showForm = false;
			loadItems();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to save item';
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this item?')) return;
		try {
			await deleteItem(id);
			loadItems();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to delete item';
		}
	}

	$: totalPages = Math.ceil(totalItems / itemsPerPage);
	$: if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

	onMount(loadItems);
</script>

<div class="container">
	<div class="header">
		<h1>Work Orders</h1>
		<button class="btn primary" on:click={openCreateForm}>Create New</button>
	</div>

	{#if $currentUser}
		<p>Welcome to the work orders page, {$currentUser.email}!</p>
	{/if}

	{#if loading}
		<p>Loading items...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if items.length === 0}
		<p>No items found.</p>
	{:else}
		<div class="items-table">
			<table>
				<thead>
					<tr>
						<th on:click={() => handleSort('title')}>
							Title {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('description')}>
							Description {sortBy === 'description' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('status')}>
							Status {sortBy === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th on:click={() => handleSort('created_at')}>
							Created {sortBy === 'created_at' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<tr>
							<td>{item.title}</td>
							<td>{item.description}</td>
							<td>{item.status}</td>
							<td>{formatDate(item.created_at)}</td>
							<td class="actions">
								<button class="btn small" on:click={() => openEditForm(item)}>Edit</button>
								<button class="btn small danger" on:click={() => handleDelete(item.id)}>Delete</button>
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
					loadItems();
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
					loadItems();
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
			<h2>{editingItem ? 'Edit' : 'Create'} Work Order</h2>
			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="title">Title</label>
					<input type="text" id="title" bind:value={formData.title} required />
				</div>
				<div class="form-group">
					<label for="description">Description</label>
					<textarea id="description" bind:value={formData.description} required></textarea>
				</div>
				<div class="form-group">
					<label for="status">Status</label>
					<select id="status" bind:value={formData.status}>
						<option value="pending">Pending</option>
						<option value="in_progress">In Progress</option>
						<option value="completed">Completed</option>
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

	.items-table {
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

	.form-group textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		height: 100px;
		resize: vertical;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}
</style>
