const API_URL = 'http://localhost:8000/api/v1';

interface PaginationParams {
	skip?: number;
	limit?: number;
	search?: string;
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
}

async function handleResponse(response: Response) {
	if (!response.ok) {
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const error = await response.json();
			throw new Error(error.detail || 'API request failed');
		} else {
			throw new Error(`API request failed: ${response.status} ${response.statusText}`);
		}
	}
	return response.json();
}

export const getItems = async (params: PaginationParams = {}) => {
	const queryParams = new URLSearchParams();
	if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
	if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
	if (params.search) queryParams.append('search', params.search);
	if (params.sort_by) queryParams.append('sort_by', params.sort_by);
	if (params.sort_order) queryParams.append('sort_order', params.sort_order);

	const response = await fetch(`${API_URL}/items/?${queryParams.toString()}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
	return handleResponse(response);
};

export const getUsers = async (params: PaginationParams = {}) => {
	const queryParams = new URLSearchParams();
	if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
	if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
	if (params.search) queryParams.append('search', params.search);
	if (params.sort_by) queryParams.append('sort_by', params.sort_by);
	if (params.sort_order) queryParams.append('sort_order', params.sort_order);

	const response = await fetch(`${API_URL}/users/?${queryParams.toString()}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
	return handleResponse(response);
};

export const createItem = async (item: any) => {
	const response = await fetch(`${API_URL}/items/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		},
		body: JSON.stringify(item)
	});
	return handleResponse(response);
};

export const updateItem = async (id: string, item: any) => {
	const response = await fetch(`${API_URL}/items/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		},
		body: JSON.stringify(item)
	});
	return handleResponse(response);
};

export const deleteItem = async (id: string) => {
	const response = await fetch(`${API_URL}/items/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
	return handleResponse(response);
};

export const updateUser = async (id: string, user: any) => {
	const response = await fetch(`${API_URL}/users/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		},
		body: JSON.stringify(user)
	});
	return handleResponse(response);
};

export const deleteUser = async (id: string) => {
	const response = await fetch(`${API_URL}/users/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
	return handleResponse(response);
};
