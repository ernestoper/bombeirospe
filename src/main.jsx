import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './App'; // Importar o componente Root que tem o Router
import { AuthProvider } from './contexts/AuthContext'; // Importar o AuthProvider
import './index.css'; // Importar o CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> { /* Envolver a aplicação com o AuthProvider */ }
      <Root />
    </AuthProvider>
  </React.StrictMode>
);


