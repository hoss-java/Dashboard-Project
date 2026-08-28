/**
 * apiConfig.ts
 * 
 * Global API configuration constants
 * Used by ApiClient to establish connection to backend
 * 
 * proxyURL: Endpoint for all backend requests (PHP proxy relay)
 * timeout: Request timeout in milliseconds
 */
// config/apiConfig.ts
export const API_CONFIG = {
  phpProxyURL: 'http://localhost:3288/sites/templateApp/proxy.php',
  // - via direct connection to the maven container
  //proxyURL: 'http://localhost:3289/api',
  //wsURL: 'http://localhost:3289/ws',
  // - via lighthttp proxy
  //proxyURL: 'http://localhost:3288/templateApp/api',
  //wsURL: 'http://localhost:3288/templateApp/ws',
  // - via nginx prox
  proxyURL: 'http://localhost:3280/templateApp/api',
  wsURL: 'http://localhost:3280/templateApp/ws',
  timeout: 5000,
  signalingMethod: 'websocket', // 'websocket' or 'http'
  usePhpProxy: false,  // Toggle: true = PHP proxy, false = lighttpd proxy
};
