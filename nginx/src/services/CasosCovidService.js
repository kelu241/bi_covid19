
import { from } from 'rxjs';
import httpInterceptor from '../utils/httpInterceptor';

// ✅ Service que usa interceptor (como HttpClient do Angular)
export const CasosCovidService = (url, method = 'GET', headers = {}, body = null, data = '2022-03-27') => {
  
  // Configurar headers padrão
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };
  
  // Configurar opções do fetch
  const fetchOptions = {
    method,
    headers: defaultHeaders
  };
  
  // Adicionar body se não for GET
  if (method !== 'GET' && body) {
    fetchOptions.body = JSON.stringify(body);
  }else if (method === 'GET' && data) {
    url += `?data=${encodeURIComponent(data)}`;
  }

  console.log('📡 CasosCovidService chamado com:', { url, method, headers: defaultHeaders, body, data });
  
  // ✅ Usar interceptor ao invés de fetch direto
  return from(
    httpInterceptor.fetch(url, fetchOptions).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
  );
};



