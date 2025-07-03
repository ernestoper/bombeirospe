import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Move auth here
import OccurrenceForm from '../components/occurrence/OccurrenceForm.jsx';
import { mockOccurrences } from '../data/mockOccurrences';

function OccurrencePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth(); // Get permission check here
  const [occurrences, setOccurrences] = useState(mockOccurrences);

  const handleSubmitOccurrence = (formData) => {
    if (!hasPermission('create_occurrence')) { // Example permission check
      alert('Você não tem permissão para criar ocorrências');
      return;
    }

    const newId = occurrences.length > 0 
      ? Math.max(...occurrences.map(o => o.id)) + 1
      : 1;
    
    const newOccurrence = {
      ...formData,
      id: newId,
      dataHora: new Date(formData.dataHora).toISOString(),
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    setOccurrences(prev => [...prev, newOccurrence]);
    
    setTimeout(() => {
      alert('Ocorrência registrada com sucesso!');
      navigate('/map');
    }, 1000);
  };

  const handleCancelOccurrence = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      {hasPermission('create_occurrence') ? (
        <OccurrenceForm 
          onSubmit={handleSubmitOccurrence}
          onCancel={handleCancelOccurrence}
        />
      ) : (
        <div className="p-4 bg-red-100 text-red-800">
          Acesso negado: você não tem permissão para acessar esta página
        </div>
      )}
    </div>
  );
}

export default OccurrencePage;