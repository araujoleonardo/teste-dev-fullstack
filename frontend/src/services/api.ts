import axios from 'axios';
import Cookie from "@/utils/cookie.ts";

// Define a base URL dinâmica
const baseURL = import.meta.env.VITE_BASE_URL

// Cria a instância do axios
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

const initialToken = Cookie.get('auth_token')

api.interceptors.request.use(config => {
  if (initialToken) {
    config.headers.Authorization = `Bearer ${initialToken}`
  }
  return config
})

export default api;
