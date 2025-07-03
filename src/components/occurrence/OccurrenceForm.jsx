import React, { useState, useEffect } from 'react';
import Card from '../common/Card';

const OccurrenceForm = ({ onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({
    tipo: '',
    dataHora: new Date().toISOString().slice(0, 16),
    status: 'Em Andamento',
    endereco: '',
    latitude: '',
    longitude: '',
    vitimas: 0,
    tempoResposta: '',
    prioridade: 'media',
    descricao: '',
    observacoes: ''
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [savedOffline, setSavedOffline] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Detectar status offline/online
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Tipos de ocorrências com campos específicos
  const occurrenceTypes = {
    'Incêndio': {
      fields: [
        { name: 'areaAtingida', label: 'Área Atingida (m²)', type: 'number' },
        { name: 'tipoMaterial', label: 'Tipo de Material', type: 'select', options: ['Madeira', 'Tecido', 'Plástico', 'Metal', 'Papel', 'Outro'] },
        { name: 'causaProvavel', label: 'Causa Provável', type: 'text' },
        { name: 'riscoPropagacao', label: 'Risco de Propagação', type: 'select', options: ['Baixo', 'Médio', 'Alto'] }
      ]
    },
    'Acidente': {
      fields: [
        { name: 'tipoVeiculo', label: 'Tipo de Veículo', type: 'select', options: ['Carro', 'Moto', 'Caminhão', 'Ônibus', 'Bicicleta', 'Outro'] },
        { name: 'gravidade', label: 'Gravidade', type: 'select', options: ['Leve', 'Moderada', 'Grave', 'Gravíssima'] },
        { name: 'condicaoVia', label: 'Condição da Via', type: 'select', options: ['Seca', 'Molhada', 'Buraco', 'Obras', 'Normal'] },
        { name: 'socorro', label: 'Socorro Necessário', type: 'select', options: ['SAMU', 'Bombeiros', 'Polícia', 'Guincho'] }
      ]
    },
    'Inundação': {
      fields: [
        { name: 'nivelAgua', label: 'Nível da Água (cm)', type: 'number' },
        { name: 'origemAgua', label: 'Origem da Água', type: 'select', options: ['Chuva', 'Rio', 'Rompimento', 'Vazamento', 'Outro'] },
        { name: 'pessoasIlhadas', label: 'Pessoas Ilhadas', type: 'number' },
        { name: 'riscoEletrico', label: 'Risco Elétrico', type: 'select', options: ['Sim', 'Não', 'Não Identificado'] }
      ]
    },
    'Salvamento': {
      fields: [
        { name: 'tipoSalvamento', label: 'Tipo de Salvamento', type: 'select', options: ['Altura', 'Aquático', 'Confinado', 'Desencarceramento', 'Outro'] },
        { name: 'equipamentosNecessarios', label: 'Equipamentos Necessários', type: 'text' },
        { name: 'numeroVitimas', label: 'Número de Vítimas', type: 'number' },
        { name: 'complexidade', label: 'Complexidade', type: 'select', options: ['Simples', 'Média', 'Complexa'] }
      ]
    },
    'Atendimento Pré-Hospitalar': {
      fields: [
        { name: 'tipoAtendimento', label: 'Tipo de Atendimento', type: 'select', options: ['Urgência', 'Emergência', 'Transporte', 'Intercorrência'] },
        { name: 'sinaisVitais', label: 'Sinais Vitais', type: 'text' },
        { name: 'procedimentosRealizados', label: 'Procedimentos Realizados', type: 'textarea' },
        { name: 'destinoTransporte', label: 'Destino do Transporte', type: 'text' }
      ]
    }
  };

  // Atualizar campos dinâmicos quando o tipo muda
  useEffect(() => {
    if (formData.tipo && occurrenceTypes[formData.tipo]) {
      setDynamicFields(occurrenceTypes[formData.tipo].fields);
    } else {
      setDynamicFields([]);
    }
  }, [formData.tipo]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationLoading(false);
          alert('Não foi possível obter a localização. Verifique as permissões do navegador.');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador.');
      setLocationLoading(false);
    }
  };

  const saveOfflineData = (data) => {
    const offlineData = JSON.parse(localStorage.getItem('offlineOccurrences') || '[]');
    const newData = {
      ...data,
      id: Date.now(),
      savedOffline: true,
      savedAt: new Date().toISOString()
    };
    offlineData.push(newData);
    localStorage.setItem('offlineOccurrences', JSON.stringify(offlineData));
    setSavedOffline(true);
  };

  // Função para simular envio de email
  const sendEmailReport = async () => {
    if (!formData.tipo || !formData.endereco) {
      alert('Por favor, preencha pelo menos o tipo de ocorrência e o endereço antes de enviar por email.');
      return;
    }

    setEmailSending(true);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mostrar mensagem de sucesso
    alert('Ocorrência enviada para o email com sucesso!');
    
    setEmailSent(true);
    setEmailSending(false);
    
    // Resetar o estado após 3 segundos
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isOffline) {
      saveOfflineData(formData);
      alert('Ocorrência salva offline. Será enviada quando a conexão for restabelecida.');
    } else {
      onSubmit(formData);
    }
  };

  const renderDynamicField = (field) => {
    const { name, label, type, options } = field;
    
    switch (type) {
      case 'select':
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione...</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'textarea':
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <textarea
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      default:
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Status da conexão */}
      <div className={`mb-4 p-3 rounded-md ${isOffline ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isOffline ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          {isOffline ? 'Modo Offline - Dados serão salvos localmente' : 'Online - Dados serão enviados imediatamente'}
        </div>
      </div>

      {/* Notificação de email enviado */}
      {emailSent && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Ocorrência enviada para o email com sucesso!
          </div>
        </div>
      )}

      {savedOffline && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
          Ocorrência salva offline com sucesso!
        </div>
      )}

      <Card title="Registro de Nova Ocorrência">
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Ocorrência *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o tipo...</option>
                {Object.keys(occurrenceTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                name="dataHora"
                value={formData.dataHora}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Em Andamento">Em Andamento</option>
                <option value="Controlado">Controlado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                name="prioridade"
                value={formData.prioridade}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço *
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              required
              placeholder="Ex: Av. Boa Viagem, 1000, Recife"
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                placeholder="-8.1169"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                placeholder="-34.8911"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {locationLoading ? 'Obtendo...' : 'Obter Localização'}
              </button>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Vítimas
              </label>
              <input
                type="number"
                name="vitimas"
                value={formData.vitimas}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de Resposta
              </label>
              <input
                type="text"
                name="tempoResposta"
                value={formData.tempoResposta}
                onChange={handleInputChange}
                placeholder="Ex: 5min"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Campos Dinâmicos por Tipo */}
          {dynamicFields.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações Específicas - {formData.tipo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicFields.map(renderDynamicField)}
              </div>
            </div>
          )}

          {/* Descrição e Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Ocorrência
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              placeholder="Descreva detalhadamente a ocorrência..."
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Adicionais
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Informações complementares..."
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-6">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={sendEmailReport}
                disabled={emailSending || !formData.tipo || !formData.endereco}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {emailSending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar por Email
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isOffline ? 'Salvar Offline' : 'Registrar Ocorrência'}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OccurrenceForm;