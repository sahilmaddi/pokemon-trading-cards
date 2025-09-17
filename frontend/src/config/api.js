// API Configuration
const getApiUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8086/api/cards';
  }
  
  // Production mode - use environment variable or fallback
  return import.meta.env.VITE_API_URL || 'https://your-backend-service.onrender.com/api/cards';
};

const getAiApiUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_AI_API_URL || 'http://localhost:8086/api/cards/ai';
  }
  
  // Production mode - use environment variable or fallback
  return import.meta.env.VITE_AI_API_URL || 'https://your-backend-service.onrender.com/api/cards/ai';
};

export const API_URL = getApiUrl();
export const AI_API_URL = getAiApiUrl();

// Log the API URLs for debugging (remove in production)
console.log('API_URL:', API_URL);
console.log('AI_API_URL:', AI_API_URL);
