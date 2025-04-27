import { writable, derived } from 'svelte/store';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import { goto } from '$app/navigation';
import type { User, UserCreate, UserUpdate, ApiError } from '$lib/types';
import { handleError } from '$lib/utils';
import { LoginService, UsersService } from '$lib/client';

export const isLoggedIn = () => {
    const token = localStorage.getItem('access_token');
    return token !== null;
};

export const currentUser = writable<User | null>(null);
export const authError = writable<string | null>(null);

export async function login(email: string, password: string) {
    try {
        authError.set(null);
        const result = await LoginService.loginAccessToken({
            email,
            password
        });
        localStorage.setItem('access_token', result.access_token);
        await checkAuth();
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        authError.set(message);
        throw error;
    }
}

export async function checkAuth() {
    try {
        if (!isLoggedIn()) {
            currentUser.set(null);
            return null;
        }
        const user = await UsersService.readUserMe();
        currentUser.set(user);
        return user;
    } catch (error) {
        handleError(error);
        currentUser.set(null);
        localStorage.removeItem('access_token');
        return null;
    }
}

export const useAuth = () => {
    const query = createQuery<User | null>({
        queryKey: ['user'],
        queryFn: checkAuth,
        enabled: isLoggedIn()
    });

    const user = derived(query, ($query) => $query.data);

    const signUpMutation = createMutation({
        mutationFn: async (data: UserCreate) => {
            return await UsersService.registerUser({
                requestBody: data
            });
        },
        onSuccess: () => {
            goto('/login');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Sign up failed';
            authError.set(message);
        }
    });

    const loginMutation = createMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const result = await LoginService.loginAccessToken(data);
            localStorage.setItem('access_token', result.access_token);
            return result;
        },
        onSuccess: async () => {
            await checkAuth();
            goto('/');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Login failed';
            authError.set(message);
            localStorage.removeItem('access_token');
        }
    });

    const logout = () => {
        localStorage.removeItem('access_token');
        currentUser.set(null);
        goto('/login');
    };

    return {
        signUpMutation,
        loginMutation,
        logout,
        user,
        error: authError,
        resetError: () => authError.set(null)
    };
};
