export interface User {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UserCreate {
    email: string;
    password: string;
    full_name?: string;
    is_superuser?: boolean;
}

export interface UserUpdate {
    email?: string;
    full_name?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface ApiError {
    detail: string;
}
