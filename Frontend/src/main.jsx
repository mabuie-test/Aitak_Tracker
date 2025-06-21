import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { SocketProvider } from './context/SocketContext'; // ← import do provider

// Interceptor para injetar o token JWT em todas as requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>          {/* ← envolvemos o App */}
      <App />
    </SocketProvider>
  </React.StrictMode>
);
