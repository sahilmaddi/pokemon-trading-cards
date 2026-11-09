// API configuration
// When you deploy, set VITE_API_URL and VITE_AI_API_URL to your backend's public URL.
// Without them the app uses the local backend in development and the same origin in production.
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return import.meta.env.DEV ? 'http://localhost:8086/api/cards' : '/api/cards';
};

const getAiApiUrl = () => {
  if (import.meta.env.VITE_AI_API_URL) return import.meta.env.VITE_AI_API_URL;
  return import.meta.env.DEV ? 'http://localhost:8086/api/cards/ai' : '/api/cards/ai';
};

export const API_URL = getApiUrl();
export const AI_API_URL = getAiApiUrl();
