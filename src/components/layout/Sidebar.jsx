import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de barra lateral de navegação
 */
const Sidebar = ({ open = true }) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  
  // Definição dos itens do menu
  const menuItems = [
    {
      title: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/dashboard',
      requiredRole: null, // Todos os usuários logados
    },
    {
      title: 'Análise',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/analysis',
      requiredRole: null, // Todos os usuários logados
    },
    {
      title: 'Mapa de Ocorrências',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      path: '/map',
      requiredRole: null, // Todos os usuários logados
    },
    {
      title: 'Relatórios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/reports',
      requiredRole: 'operador', // Apenas operadores e superiores
    },
    {
      title: 'Administração',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/admin',
      requiredRole: 'admin', // Apenas administradores
    },
  ];
  
  // Filtrar itens do menu com base nas permissões do usuário
  const filteredMenuItems = menuItems.filter(
    item => !item.requiredRole || hasPermission(item.requiredRole)
  );
  
  // Se o sidebar não estiver aberto, mostrar apenas ícones
  if (!open) {
    return (
      <div className="h-screen bg-gray-800 text-white w-16 flex flex-col shadow-lg z-10">
        <div className="p-4 flex justify-center border-b border-gray-700">
          <img
            className="h-8 w-auto"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Brasao_corpo_de_bombeiros_militar_de_pernambuco.png"
            alt="CBMPE Logo"
          />
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {filteredMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center justify-center p-2 rounded-md ${
                location.pathname === item.path
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title={item.title}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || '?'}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Versão completa do sidebar
  return (
    <div className="h-screen bg-gray-800 text-white w-64 flex flex-col shadow-lg z-10">
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <img
            className="h-8 w-auto mr-2"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Brasao_corpo_de_bombeiros_militar_de_pernambuco.png"
            alt="CBMPE Logo"
          />
          <span className="font-semibold text-lg">CBMPE BI</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-md ${
              location.pathname === item.path
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;