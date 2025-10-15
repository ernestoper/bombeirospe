import React from 'react';
import Card from '../common/Card';
import AnimatedNumber from '../common/AnimatedNumber';

// Ícones podem ser adicionados usando uma biblioteca como heroicons ou lucide-react
// Exemplo: import { FireIcon, ClockIcon, UsersIcon, BellAlertIcon } from '@heroicons/react/24/outline';

function KPICard({ title, value, change, changeType, icon: IconComponent, animate = true, trend }) {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-success' : 'text-destructive';
  
  // Extrair número do value se for string
  const numericValue = typeof value === 'string' ? value.match(/\d+/)?.[0] : value;
  const suffix = typeof value === 'string' ? value.replace(/\d+/g, '').trim() : '';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {animate && numericValue ? (
                <>
                  <AnimatedNumber value={numericValue} />
                  {suffix && ` ${suffix}`}
                </>
              ) : (
                value
              )}
            </p>
            {trend && (
              <span className={`text-lg ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              </span>
            )}
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${changeColor} mt-1`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isPositive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              {change}
            </div>
          )}
        </div>
        {IconComponent && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="h-7 w-7" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default KPICard;

