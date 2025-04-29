import React from 'react';

// Ícones podem ser adicionados (e.g., UserCircleIcon, ArrowLeftOnRectangleIcon from heroicons)

function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0 flex items-center">
            {/* <img className="h-8 w-auto" src="/path/to/cbmpe_logo_small.png" alt="CBMPE" /> */}
            <span className="ml-2 text-xl font-bold text-blue-800">CBMPE BI</span>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4">
                Olá, {user.nome} ({user.perfil})
              </span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                title="Sair"
              >
                {/* <ArrowLeftOnRectangleIcon className="h-6 w-6" /> */}
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

