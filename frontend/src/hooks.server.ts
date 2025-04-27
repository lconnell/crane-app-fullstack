import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Handle favicon requests
	if (event.url.pathname === '/favicon.ico' || event.url.pathname === '/favicon.png') {
		return new Response(null, { status: 204 });
	}

	return resolve(event);
};
