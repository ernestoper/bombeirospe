import React from 'react';
import AnimatedNumber from '../common/AnimatedNumber';

/**
 * Card de estatísticas em tempo real
 */
export function LiveStatsCard({ occurrences }) {
  // Calcular estatísticas
  const equipesAtivas = new Set(
    occurrences
      .filter(o => o.status === 'Em Andamento')
      .flatMap(o => o.equipesEnvolvidas || [])
  ).size;
  
  const viaturasEmCampo = new Set(
    occurrences
      .filter(o => o.status === 'Em Andamento' || o.status === 'Controlado')
      .flatMap(o => o.viaturasEnvolvidas || [])
  ).size;
  
  const ocorrenciasAtivas = occurrences.filter(
    o => o.status === 'Em Andamento' || o.status === 'Controlado'
  ).length;
  
  const vitimasTotal = occurrences
    .filter(o => o.status === 'Em Andamento')
    .reduce((sum, o) => sum + (o.vitimas || 0), 0);
  
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Status em Tempo Real</h3>
        <span className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">Ao vivo</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">Equipes Ativas</p>
          <p className="text-4xl font-bold">
            <AnimatedNumber value={equipesAtivas} />
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">Viaturas em Campo</p>
          <p className="text-4xl font-bold">
            <AnimatedNumber value={viaturasEmCampo} />
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">Ocorrências Ativas</p>
          <p className="text-4xl font-bold">
            <AnimatedNumber value={ocorrenciasAtivas} />
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">Vítimas Atendidas</p>
          <p className="text-4xl font-bold">
            <AnimatedNumber value={vitimasTotal} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiveStatsCard;
