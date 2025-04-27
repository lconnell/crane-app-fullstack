import type { User, UserCreate, UserUpdate, Token } from '$lib/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = localStorage.getItem('access_token');
	const headers = new Headers(options.headers);

	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	const response = await fetch(`${API_URL}${API_PREFIX}${endpoint}`, {
		...options,
		headers
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.detail || 'An error occurred');
	}

	return response.json();
}

export const LoginService = {
	loginAccessToken: async (data: { email: string; password: string }) => {
		const formData = new URLSearchParams();
		formData.append('username', data.email);
		formData.append('password', data.password);
		formData.append('grant_type', 'password');
		formData.append('scope', '');

		console.log('Login request data:', {
			url: `${API_URL}${API_PREFIX}/login/access-token`,
			formData: Object.fromEntries(formData.entries())
		});

		try {
			const response = await fetch(`${API_URL}${API_PREFIX}/login/access-token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				body: formData
			});

			const responseData = await response.json();
			console.log('Login response:', responseData);

			if (!response.ok) {
				throw new Error(responseData.detail || 'Login failed');
			}

			return responseData as Token;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	}
};

export const UsersService = {
	readUserMe: () => fetchApi<User>('/users/me'),

	registerUser: (data: { requestBody: UserCreate }) =>
		fetchApi<User>('/users', {
			method: 'POST',
			body: JSON.stringify(data.requestBody)
		}),

	updateUser: (data: { userId: string; requestBody: UserUpdate }) =>
		fetchApi<User>(`/users/${data.userId}`, {
			method: 'PUT',
			body: JSON.stringify(data.requestBody)
		}),

	deleteUser: (data: { userId: string }) =>
		fetchApi<void>(`/users/${data.userId}`, {
			method: 'DELETE'
		})
};
