import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './../components/auth/LoginForm';
import { useAuth } from './../contexts/AuthContext'; // Importe o useAuth do contexto

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtenha a função login do contexto

  const handleLoginSuccess = async (username, password) => {
    try {
      await login(username, password);
      navigate('/dashboard'); // Redireciona após login bem-sucedido
    } catch (error) {
      // O erro já será tratado pelo LoginForm
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800">CBMPE</h1>
        <h2 className="text-xl text-center text-gray-600">Dasboard</h2>
      </div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default LoginPage;

