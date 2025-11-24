
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://mooc-ambiental-backend-production.up.railway.app');

// 2. Helper para llamar a la API
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText, { url });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Si no hay contenido (204), devolvemos null
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error('Error en apiRequest:', { url, options: mergedOptions, error });
    throw error;
  }
};
