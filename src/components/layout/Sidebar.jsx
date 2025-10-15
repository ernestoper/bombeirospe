import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

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
      <div className="h-screen bg-gradient-to-b from-primary via-primary to-primary/90 text-white w-16 flex flex-col shadow-xl z-10 backdrop-blur-sm">
        <div className="p-4 flex justify-center border-b border-white/10">
          <img
            className="h-8 w-auto drop-shadow-lg"
            src={logo}
            alt="CBMPE Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Brasao_corpo_de_bombeiros_militar_de_pernambuco.png';
            }}
          />
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {filteredMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                  ? 'bg-white/20 text-white shadow-lg scale-105 backdrop-blur-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                }`}
              title={item.title}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white/30">
              {user?.name?.charAt(0) || '?'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versão completa do sidebar
  return (
    <div className="h-screen bg-gradient-to-b from-primary to-primary text-white w-64 flex flex-col shadow-2xl z-10">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-auto drop-shadow-lg"
            src={logo}
            alt="CBMPE Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Brasao_corpo_de_bombeiros_militar_de_pernambuco.png';
            }}
          />
          <div>
            <span className="font-bold text-lg tracking-tight">CBMPE</span>
            <p className="text-xs text-white/70 font-medium">Business Intelligence</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-2">
        {filteredMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                ? 'bg-white bg-opacity-20 text-white shadow-lg'
                : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white'
              }`}
          >
            <div className={`transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className="ml-3 font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white border-opacity-10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-15 transition-all duration-300">
          <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white ring-opacity-30">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-white/60">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;