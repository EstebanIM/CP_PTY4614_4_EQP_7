export async function fetcher(url, options = {}) {
    const token = localStorage.getItem('jwt'); // Recuperar el token del almacenamiento local
  
    // Añadir el token a las cabeceras si existe
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
  
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data;
  }
  