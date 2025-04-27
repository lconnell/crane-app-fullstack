import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET({ params, url, request }: RequestEvent) {
  const response = await fetch(`${API_URL}/${params.path}${url.search}`, {
    headers: request.headers,
  });

  if (!response.ok) {
    throw error(response.status, await response.text());
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST({ params, request }: RequestEvent) {
  const response = await fetch(`${API_URL}/${params.path}`, {
    method: 'POST',
    headers: request.headers,
    body: request.body,
  });

  if (!response.ok) {
    throw error(response.status, await response.text());
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function PUT({ params, request }: RequestEvent) {
  const response = await fetch(`${API_URL}/${params.path}`, {
    method: 'PUT',
    headers: request.headers,
    body: request.body,
  });

  if (!response.ok) {
    throw error(response.status, await response.text());
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function DELETE({ params, request }: RequestEvent) {
  const response = await fetch(`${API_URL}/${params.path}`, {
    method: 'DELETE',
    headers: request.headers,
  });

  if (!response.ok) {
    throw error(response.status, await response.text());
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
