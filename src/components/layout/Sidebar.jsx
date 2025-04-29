import React from 'react';

// Ícones podem ser adicionados (e.g., ChartPieIcon, TableCellsIcon, MapIcon, CogIcon from heroicons)

// Simulação de NavLink do react-router-dom
const NavLink = ({ to, children, className = '', activeClassName = '' }) => {
  // Em uma app real, usar NavLink do react-router-dom para obter o estado ativo
  const isActive = window.location.pathname === to; // Simulação básica
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`;
  return (
    <a href={to} className={combinedClassName}>
      {children}
    </a>
  );
};

function Sidebar({ user }) {
  const isAdmin = user?.perfil === 'Administrador';

  const linkClass = "flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900";
  const activeLinkClass = "bg-gray-200 text-gray-900";

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-16 flex-shrink-0"> {/* top-16 para ficar abaixo do Header */}
      <nav className="p-4 space-y-1">
        <NavLink 
          to="/dashboard" 
          className={linkClass} 
          activeClassName={activeLinkClass}
        >
          {/* <ChartPieIcon className="mr-3 h-5 w-5" /> */}
          Dashboard
        </NavLink>
        <NavLink 
          to="/analysis" 
          className={linkClass} 
          activeClassName={activeLinkClass}
        >
          {/* <TableCellsIcon className="mr-3 h-5 w-5" /> */}
          Análise Detalhada
        </NavLink>
        {/* Adicionar link para Mapa Completo se houver página dedicada */}
        {/* <NavLink 
          to="/map" 
          className={linkClass} 
          activeClassName={activeLinkClass}
        >
          <MapIcon className="mr-3 h-5 w-5" />
          Mapa Completo
        </NavLink> */} 

        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={linkClass} 
            activeClassName={activeLinkClass}
          >
            {/* <CogIcon className="mr-3 h-5 w-5" /> */}
            Painel Administrativo
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;

