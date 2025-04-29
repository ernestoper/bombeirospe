import React from 'react';
import Card from '../common/Card';

// Ícones podem ser adicionados usando uma biblioteca como heroicons ou lucide-react
// Exemplo: import { FireIcon, ClockIcon, UsersIcon, BellAlertIcon } from '@heroicons/react/24/outline';

function KPICard({ title, value, change, changeType, icon: IconComponent }) {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  // const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon; // Ícone de seta para mudança

  return (
    <Card className="flex items-center space-x-4">
      {IconComponent && (
        <div className="p-3 rounded-full bg-blue-100 text-blue-600"> {/* Cor CBMPE primária (azul) */} 
          <IconComponent className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`mt-1 text-sm font-medium ${changeColor} flex items-center`}>
            {/* <ChangeIcon className="h-4 w-4 mr-1" /> */}
            {change}
            {/* <span className="text-gray-500 ml-1">vs período anterior</span> */}
          </p>
        )}
      </div>
    </Card>
  );
}

export default KPICard;

