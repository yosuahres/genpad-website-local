import { createClient } from './supabase/client';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error('User session not found. Please log in.');
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    console.error('Unauthorized request - session might be expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}