import axios from 'axios';

// Configuration de l'instance axios avec l'URL de base
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL du serveur backend
  timeout: 5000, // Timeout de 5 secondes
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;