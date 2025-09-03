// src/api/axiosConfig.ts
import axios from 'axios';

// Criação de uma instância do Axios com configurações personalizadas
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:1234/v1', // Base URL para a API
  timeout: 20000, // Aumente o tempo limite para 20 segundos
  maxBodyLength: Infinity, // Permitir tamanho de corpo ilimitado
  maxContentLength: Infinity, // Permitir tamanho de conteúdo ilimitado
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo
  },
});

// Exporta a instância para ser usada em outros arquivos
export default apiClient;
