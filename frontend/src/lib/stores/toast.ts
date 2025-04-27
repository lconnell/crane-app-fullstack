import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'info') => {
			const id = Math.random().toString(36).slice(2);
			update(toasts => [...toasts, { id, message, type }]);
			setTimeout(() => {
				update(toasts => toasts.filter(t => t.id !== id));
			}, 5000);
		},
		remove: (id: string) => {
			update(toasts => toasts.filter(t => t.id !== id));
		},
		success: (message: string) => {
			createToastStore().add(message, 'success');
		},
		error: (message: string) => {
			createToastStore().add(message, 'error');
		},
		info: (message: string) => {
			createToastStore().add(message, 'info');
		}
	};
}

export const toastStore = createToastStore();
