import React from 'react';
import Card from '../common/Card';
import { mockOccurrences } from '../../data/mockOccurrences'; // Importar dados mock

function SummaryTable({ data = mockOccurrences.slice(0, 10) }) { // Exibir as 10 últimas por padrão

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Em Andamento':
      case 'Controlado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <h3 className="text-lg font-medium leading-6 text-gray-900 p-4 border-b border-gray-200">Últimas Ocorrências</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((ocorrencia) => (
              <tr key={ocorrencia.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ocorrencia.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ocorrencia.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={`${ocorrencia.endereco}, ${ocorrencia.bairro}`}>{`${ocorrencia.endereco}, ${ocorrencia.bairro}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ocorrencia.dataHora).toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(ocorrencia.status)}`}>
                    {ocorrencia.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <p className="text-center text-gray-500 p-4">Nenhuma ocorrência recente encontrada.</p>
      )}
    </Card>
  );
}

export default SummaryTable;

