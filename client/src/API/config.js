// In development the server runs separately on port 1234; in production it serves the site itself
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:1234/api' : '/api')
