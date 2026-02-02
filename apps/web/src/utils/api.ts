import { createClient } from './supabase/client';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // 1. Check for session existence
  if (sessionError || !session) {
    throw new Error('AUTH_SESSION_MISSING');
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

  // 2. Handle 401 specifically for expired/invalid tokens
  if (response.status === 401) {
    throw new Error('AUTH_UNAUTHORIZED');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.status}`);
  }

  return response.json();
}