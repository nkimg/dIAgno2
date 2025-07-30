import React from 'react';

function Tag({ label, isSelected, onClick }) {
  // Estilos base para todas as tags
  const baseStyle = "px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium border";

  // Estilos para uma tag selecionada
  const selectedStyle = "bg-primary text-white border-primary shadow-md";

  // Estilos para uma tag não selecionada
  const unselectedStyle = "bg-surface text-text-subtle border-border-color hover:bg-gray-50 hover:border-gray-300";

  return (
    <div 
      onClick={onClick} 
      className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`}
    >
      {label}
    </div>
  );
}

export default Tag;