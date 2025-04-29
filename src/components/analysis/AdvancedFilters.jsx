import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

// Tipos de ocorrência e status podem vir de uma constante ou API
const tiposOcorrencia = [
  'Incêndio',
  'Resgate',
  'Salvamento',
  'Atendimento Pré-Hospitalar',
  'Incêndio Florestal',
  'Resgate Animal',
  'Vazamento de Gás',
  'Incêndio em Veículo',
  'Resgate Aquático',
  'Desabamento',
  'Corte de Árvore',
  'Salvamento em Altura',
  'Produto Perigoso',
];
const statusOcorrencia = ['Em Andamento', 'Finalizado', 'Cancelado', 'Controlado'];

function AdvancedFilters({ onApplyFilters, onClearFilters }) {
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [bairro, setBairro] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    // Passar null se a data não for válida
    const startDate = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
    const endDate = dataFim ? new Date(dataFim + 'T23:59:59') : null;

    if (startDate && endDate && startDate > endDate) {
        alert('A data de início não pode ser posterior à data de fim.');
        return;
    }

    onApplyFilters({ 
        tipo,
        dataInicio: startDate,
        dataFim: endDate,
        bairro,
        status 
    });
  };

  const handleClear = () => {
    setTipo('');
    setDataInicio('');
    setDataFim('');
    setBairro('');
    setStatus('');
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros Avançados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Filtro Tipo de Ocorrência */}
        <div>
          <label htmlFor="tipoOcorrencia" className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            id="tipoOcorrencia"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            {tiposOcorrencia.sort().map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Filtro Data Início */}
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">Data Início</label>
          <input 
            type="date" 
            id="dataInicio" 
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          />
        </div>

        {/* Filtro Data Fim */}
        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Data Fim</label>
          <input 
            type="date" 
            id="dataFim" 
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          />
        </div>

        {/* Filtro Bairro */}
        <div>
          <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
          <input
            type="text"
            id="bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Digite o bairro"
          />
        </div>

        {/* Filtro Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            {statusOcorrencia.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
        <Button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-600 focus:ring-gray-400"
        >
          Limpar Filtros
        </Button>
        <Button onClick={handleApply}>
          Aplicar Filtros
        </Button>
      </div>
    </Card>
  );
}

export default AdvancedFilters;

