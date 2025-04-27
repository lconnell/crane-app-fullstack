import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Handle favicon requests
	if (url.pathname === '/favicon.ico') {
		return new Response(null, { status: 204 });
	}

	return {};
};
