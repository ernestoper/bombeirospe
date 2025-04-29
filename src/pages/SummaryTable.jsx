import React from 'react';
import Card from '../common/Card';

// Componente de tabela de resumo para exibir ocorrências
const SummaryTable = ({ data = [], onSelectRow }) => {
  // Função para formatar data/hora em formato legível
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card title="Ocorrências Recentes">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vítimas
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((occurrence) => (
              <tr 
                key={occurrence.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectRow && onSelectRow(occurrence)}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    occurrence.tipo === 'Incêndio' ? 'bg-red-100 text-red-800' :
                    occurrence.tipo === 'Acidente' ? 'bg-orange-100 text-orange-800' :
                    occurrence.tipo === 'Resgate' ? 'bg-blue-100 text-blue-800' :
                    occurrence.tipo === 'Inundação' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {occurrence.tipo}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(occurrence.dataHora)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    occurrence.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                    occurrence.status === 'Controlado' ? 'bg-blue-100 text-blue-800' :
                    occurrence.status === 'Finalizado' ? 'bg-green-100 text-green-800' : ''
                  }`}>
                    {occurrence.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-gray-600 max-w-xs truncate">
                  {occurrence.endereco}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={occurrence.vitimas ? 'font-medium text-red-600' : 'text-gray-600'}>
                    {occurrence.vitimas || '0'}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRow && onSelectRow(occurrence);
                    }}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
            
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500">
                  Nenhuma ocorrência encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SummaryTable;