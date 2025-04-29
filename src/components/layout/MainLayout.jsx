import React, { useState } from 'react';
import { useAuth } from './../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Layout principal do sistema - envolve todas as páginas protegidas
 * fornecendo estrutura de header, sidebar e área de conteúdo
 */
const MainLayout = ({ children, pageTitle = "CBMPE Business Intelligence" }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Função para alternar o sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} user={user} />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={user} 
          toggleSidebar={toggleSidebar} 
          pageTitle={pageTitle}
        />
        
        {/* Conteúdo principal com scroll */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="container mx-auto">
            {/* Título da página, se necessário */}
            {pageTitle && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{pageTitle}</h2>
                <div className="text-sm text-gray-600">
                  Atualizado em: {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
            )}
            
            {/* Conteúdo da página (injetado como children) */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;