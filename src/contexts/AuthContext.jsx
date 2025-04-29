import React, { createContext, useState, useEffect, useContext } from 'react';
// Em um projeto real, você importaria suas APIs aqui
// import { api } from '../services/api';

// Criando o contexto de autenticação
export const AuthContext = createContext();

// Hook personalizado para utilizar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Estado para armazenar informações do usuário logado
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Em um app real, você verificaria um token JWT no localStorage
        // e faria uma chamada à API para validar o token
        const token = localStorage.getItem('cbmpe_token');
        
        if (token) {
          // Aqui você faria uma chamada à API para validar o token
          // const response = await api.get('/auth/validate-token');
          
          // Simulando resposta de sucesso
          const userData = JSON.parse(localStorage.getItem('cbmpe_user'));
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, limpa o estado de autenticação
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('cbmpe_token');
        localStorage.removeItem('cbmpe_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função para realizar login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Em um app real, você faria uma requisição para seu backend
      // const response = await api.post('/auth/login', { email, password });
      
      // Simulando validação de login com dados mockados para testes
      if (email === 'admin@cbmpe.gov.br' && password === 'senha123') {
        const userData = {
          id: 1,
          name: 'Administrador CBMPE',
          email: email,
          role: 'admin',
          patente: 'Coronel',
          unidade: 'Quartel do Comando Geral',
          photoUrl: null
        };
        
        const token = 'jwt-token-simulado-' + Math.random().toString(36).substring(2);
        
        // Armazenando informações do usuário
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('cbmpe_token', token);
        localStorage.setItem('cbmpe_user', JSON.stringify(userData));
        
        return { success: true };
      } else if (email === 'bombeiro@cbmpe.gov.br' && password === 'senha123') {
        const userData = {
          id: 2,
          name: 'Bombeiro Operacional',
          email: email,
          role: 'operador',
          patente: 'Tenente',
          unidade: 'Quartel de Boa Viagem',
          photoUrl: null
        };
        
        const token = 'jwt-token-simulado-' + Math.random().toString(36).substring(2);
        
        // Armazenando informações do usuário
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('cbmpe_token', token);
        localStorage.setItem('cbmpe_user', JSON.stringify(userData));
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: 'Email ou senha incorretos' 
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        message: 'Ocorreu um erro durante o login. Tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Função para realizar logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cbmpe_token');
    localStorage.removeItem('cbmpe_user');
  };

  // Verifica se o usuário tem determinada permissão/role
  const hasPermission = (requiredRole) => {
    if (!isAuthenticated || !user) return false;
    
    // Você pode implementar lógica mais complexa de permissões aqui
    // Por exemplo, um array de permissões ou níveis hierárquicos
    
    // Implementação simples baseada em role
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    
    if (requiredRole === 'operador') {
      return user.role === 'admin' || user.role === 'operador';
    }
    
    return true; // Permissão básica para usuários autenticados
  };

  // Fornecendo o contexto para a aplicação
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
