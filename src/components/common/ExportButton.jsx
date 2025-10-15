import React, { useState } from 'react';
import { toast } from 'sonner';

/**
 * Botão para exportar dados
 */
export function ExportButton({ data, filename = 'dados', type = 'all' }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    try {
      setIsExporting(true);
      
      if (!data || data.length === 0) {
        toast.error('Nenhum dado para exportar');
        return;
      }

      // Criar CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success('Dados exportados com sucesso!', {
        description: `Arquivo ${filename}.csv baixado`
      });
    } catch (error) {
      toast.error('Erro ao exportar dados', {
        description: error.message
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    try {
      setIsExporting(true);
      
      if (!data || data.length === 0) {
        toast.error('Nenhum dado para exportar');
        return;
      }

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast.success('Dados exportados com sucesso!', {
        description: `Arquivo ${filename}.json baixado`
      });
    } catch (error) {
      toast.error('Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = () => {
    try {
      const text = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(text);
      toast.success('Dados copiados!', {
        description: 'Dados copiados para a área de transferência'
      });
    } catch (error) {
      toast.error('Erro ao copiar dados');
    }
  };

  if (type === 'csv') {
    return (
      <button
        onClick={exportToCSV}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exportando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </>
        )}
      </button>
    );
  }

  // Dropdown com múltiplas opções
  return (
    <div className="relative group">
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <button
          onClick={exportToCSV}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 first:rounded-t-xl"
        >
          📊 Exportar CSV
        </button>
        <button
          onClick={exportToJSON}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
        >
          📄 Exportar JSON
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 last:rounded-b-xl"
        >
          📋 Copiar Dados
        </button>
      </div>
    </div>
  );
}

export default ExportButton;
