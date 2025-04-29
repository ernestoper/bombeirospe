import React from 'react';

function Button({ children, onClick, type = 'button', className = '', disabled = false }) {
  const baseStyle = 'inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2';
  const colorStyle = disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'; // Cor CBMPE primária (azul) pode ser usada aqui

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${colorStyle} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

