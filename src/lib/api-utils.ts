import { requireCurrentUserId } from './user-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3002/api/v1';

/**
 * Default configuration for authenticated API calls
 */
export function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    // JWT token is now in cookies, no need for Authorization header
  };
}

/**
 * Performs an authenticated API call with user ID
 * @param endpoint - The API endpoint (e.g., '/onboarding/progress')
 * @param options - Fetch options
 * @param includeUserId - If true, includes user ID in the URL
 * @returns Promise of the response
 */
export async function authenticatedFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  includeUserId: boolean = true
): Promise<T> {
  let url = `${API_BASE_URL}`;

  if (includeUserId) {
    // For auth service, use '/users/me' instead of '/users/{id}'
    url += `/users/me${endpoint}`;
  } else {
    url += endpoint;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include', // Important to send authentication cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error ${response.status}: ${response.statusText}`);
  }

  // Return void for 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Shortcut for authenticated GET request
 */
export function authenticatedGet<T = any>(
  endpoint: string,
  includeUserId: boolean = true
): Promise<T> {
  return authenticatedFetch<T>(endpoint, { method: 'GET' }, includeUserId);
}

/**
 * Shortcut for authenticated POST request
 */
export function authenticatedPost<T = any>(
  endpoint: string,
  data?: any,
  includeUserId: boolean = true
): Promise<T> {
  return authenticatedFetch<T>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    includeUserId
  );
}

/**
 * Shortcut for authenticated PATCH request
 */
export function authenticatedPatch<T = any>(
  endpoint: string,
  data?: any,
  includeUserId: boolean = true
): Promise<T> {
  return authenticatedFetch<T>(
    endpoint,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    includeUserId
  );
}

/**
 * Shortcut for authenticated DELETE request
 */
export function authenticatedDelete<T = any>(
  endpoint: string,
  includeUserId: boolean = true
): Promise<T> {
  return authenticatedFetch<T>(endpoint, { method: 'DELETE' }, includeUserId);
}
