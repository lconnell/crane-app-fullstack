import type { ApiError } from './types';

export function handleError(error: unknown): never {
    if (error instanceof Error) {
        throw error;
    }

    if (typeof error === 'object' && error !== null && 'detail' in error) {
        const apiError = error as ApiError;
        throw new Error(apiError.detail);
    }

    throw new Error('An unexpected error occurred');
}
