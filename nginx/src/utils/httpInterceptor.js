// HTTP Interceptor similar ao Angular
class HttpInterceptor {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // Adicionar interceptor de request
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Adicionar interceptor de response
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Fetch customizado com interceptors
  async fetch(url, options = {}) {
    let config = { ...options };

    // Aplicar interceptors de REQUEST
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config, url);
    }

    try {
      // Fazer a requisição
      let response = await fetch(url, config);

      // Aplicar interceptors de RESPONSE
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      return response;
    } catch (error) {
      // Tratar erros nos interceptors se necessário
      throw error;
    }
  }
}

// Instância global do interceptor
const httpInterceptor = new HttpInterceptor();

// ✅ INTERCEPTOR DE TOKEN (como no Angular)
httpInterceptor.addRequestInterceptor((config, url) => {
  // Pegar token do localStorage
  const token = localStorage.getItem('authToken');
  
  if (token) {
    // Adicionar Authorization header
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  // Sempre adicionar Content-Type se não existir
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  console.log('🔐 Request para:', url, 'Token:', token ? 'PRESENTE' : 'AUSENTE');
  console.log('Headers enviados:', config.headers);
  return config;
});

// ✅ INTERCEPTOR DE RESPONSE (para tratar 401, etc)
httpInterceptor.addResponseInterceptor(async (response) => {
  console.log(`📡 Response recebida: ${response.status} para ${response.url}`);
  
  // Se token expirou (401)
  if (response.status === 401) {
    console.warn('🚨 Error 401 - Não autorizado');
    console.warn('Verifique se:');
    console.warn('1. O token está presente no localStorage');
    console.warn('2. O servidor backend está aceitando o token');
    console.warn('3. A rota realmente precisa de autenticação');
    
    // Limpar token
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Redirecionar para login (ou disparar evento)
    // window.location.href = '/login';
  }
  
  // Se erro de servidor (5xx)
  if (response.status >= 500) {
    console.error('🔥 Erro no servidor:', response.status);
    // Poderia mostrar toast de erro global
  }
  
  return response;
});

export default httpInterceptor;