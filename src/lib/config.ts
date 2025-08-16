// src/lib/config.ts - VERSIÓN CORREGIDA
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Función de debug para verificar la URL
console.log('🔍 API_BASE_URL configurada:', API_BASE_URL);
console.log('🔍 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Asegurarse de que endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  // Debug: mostrar la URL completa que se va a usar
  console.log('🌐 Haciendo petición a:', url);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    console.log('📡 Respuesta recibida:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en API Request:', error);
    console.error('🔍 URL que falló:', url);
    console.error('🔍 Opciones:', mergedOptions);
    throw error;
  }
};