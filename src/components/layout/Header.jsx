import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de cabeçalho para todas as páginas
 */
const Header = ({ toggleSidebar, pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock de notificações para demonstração
  const notifications = [
    { id: 1, message: 'Nova ocorrência registrada', time: '5 min atrás', read: false },
    { id: 2, message: 'Atualização de status em Boa Viagem', time: '30 min atrás', read: false },
    { id: 3, message: 'Relatório diário disponível', time: '2 horas atrás', read: true },
  ];
  
  // Função para realizar logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Lado esquerdo - Menu toggle e título */}
          <div className="flex">
            <button
              type="button"
              className="px-4 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-300 hover:bg-gray-50"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Abrir menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center ml-2">
              <div className="flex-shrink-0 flex items-center">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    CBMPE
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Business Intelligence</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lado direito - Notificações e perfil do usuário */}
          <div className="flex items-center">
            {/* Notificações */}
            <div className="relative ml-3">
              <button
                className="p-2 text-gray-600 rounded-xl hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 relative transition-all duration-300"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <span className="sr-only">Ver notificações</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary shadow-lg animate-pulse"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-2xl shadow-xl bg-white ring-1 ring-gray-200 focus:outline-none animate-scale-in backdrop-blur-sm">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
                      <p className="text-sm font-semibold text-gray-800">Notificações</p>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-2 hover:bg-gray-100 ${!notification.read ? 'bg-primary/10' : ''}`}
                          >
                            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-center">
                        <p className="text-sm text-gray-500">Nenhuma notificação</p>
                      </div>
                    )}
                    <div className="border-t border-gray-200 px-4 py-2">
                      <a href="#" className="text-sm text-primary hover:text-primary/90">Ver todas</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Menu do usuário */}
            <div className="relative ml-3">
              <button
                className="flex items-center max-w-xs rounded-xl bg-white hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 px-2 py-1 transition-all duration-300 border border-gray-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Abrir menu do usuário</span>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0) || '?'}
                </div>
                <div className="ml-2 hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-800">{user?.name || 'Usuário'}</div>
                  <div className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</div>
                </div>
                <svg className="ml-2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white ring-1 ring-gray-200 focus:outline-none animate-scale-in backdrop-blur-sm overflow-hidden">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors duration-200"
                      role="menuitem"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Seu Perfil
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors duration-200"
                      role="menuitem"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configurações
                    </a>
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        role="menuitem"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;