import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Utilizando o hook personalizado para obter as funções do contexto
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Chamando a função de login do contexto
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email ou Matrícula
        </label>
        <input
          id="email"
          name="email"
          type="text"
          required
          autoComplete="username"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Digite seu email ou matrícula"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
      
      {/* Credenciais de teste para desenvolvimento */}
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <p className="text-xs text-gray-500 font-medium mb-1">Credenciais de teste:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <p className="font-medium">Admin:</p>
            <p>admin@cbmpe.gov.br</p>
            <p>senha123</p>
          </div>
          <div>
            <p className="font-medium">Bombeiro:</p>
            <p>bombeiro@cbmpe.gov.br</p>
            <p>senha123</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
