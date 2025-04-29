// src/data/mockOccurrences.js
export const mockOccurrences = [
  {
    id: 1,
    tipo: 'Incêndio',
    dataHora: '2025-04-29T08:30:00',
    status: 'Em Andamento',
    endereco: 'Av. Boa Viagem, 1000, Recife',
    latitude: -8.1169,
    longitude: -34.8911,
    vitimas: 0,
    tempoResposta: '5min'
  },
  {
    id: 2,
    tipo: 'Acidente',
    dataHora: '2025-04-29T09:15:00',
    status: 'Controlado',
    endereco: 'Rua da Aurora, 500, Recife',
    latitude: -8.0576,
    longitude: -34.8811,
    vitimas: 2,
    tempoResposta: '8min'
  },
  {
    id: 3,
    tipo: 'Inundação',
    dataHora: '2025-04-28T18:45:00',
    status: 'Finalizado',
    endereco: 'Av. Agamenon Magalhães, 2000, Recife',
    latitude: -8.0535,
    longitude: -34.8848,
    vitimas: 0,
    tempoResposta: '12min'
  },
  {
    id: 4,
    tipo: 'Incêndio',
    dataHora: '2025-04-28T14:20:00',
    status: 'Finalizado',
    endereco: 'Rua do Bom Jesus, 100, Recife',
    latitude: -8.0636,
    longitude: -34.8716,
    vitimas: 1,
    tempoResposta: '7min'
  },
  {
    id: 5,
    tipo: 'Resgate',
    dataHora: '2025-04-29T06:10:00',
    status: 'Em Andamento',
    endereco: 'Av. Conde da Boa Vista, 1500, Recife',
    latitude: -8.0623,
    longitude: -34.8871,
    vitimas: 1,
    tempoResposta: '10min'
  },
  {
    id: 6,
    tipo: 'Acidente',
    dataHora: '2025-04-27T22:30:00',
    status: 'Finalizado',
    endereco: 'Av. Caxangá, 2500, Recife',
    latitude: -8.0344,
    longitude: -34.9229,
    vitimas: 3,
    tempoResposta: '6min'
  },
  {
    id: 7,
    tipo: 'Incêndio',
    dataHora: '2025-04-28T11:45:00',
    status: 'Finalizado',
    endereco: 'Rua da Hora, 800, Recife',
    latitude: -8.0524,
    longitude: -34.9017,
    vitimas: 0,
    tempoResposta: '9min'
  },
  {
    id: 8,
    tipo: 'Resgate',
    dataHora: '2025-04-29T05:20:00',
    status: 'Em Andamento',
    endereco: 'Av. Conselheiro Rosa e Silva, 1200, Recife',
    latitude: -8.0318,
    longitude: -34.9123,
    vitimas: 2,
    tempoResposta: '11min'
  },
  {
    id: 9,
    tipo: 'Inundação',
    dataHora: '2025-04-28T19:15:00',
    status: 'Controlado',
    endereco: 'Av. Recife, 3000, Recife',
    latitude: -8.0865,
    longitude: -34.9225,
    vitimas: 0,
    tempoResposta: '15min'
  },
  {
    id: 10,
    tipo: 'Acidente',
    dataHora: '2025-04-29T07:30:00',
    status: 'Em Andamento',
    endereco: 'Rua Real da Torre, 1000, Recife',
    latitude: -8.0417,
    longitude: -34.9108,
    vitimas: 4,
    tempoResposta: '8min'
  },
  {
    id: 11,
    tipo: 'Incêndio',
    dataHora: '2025-04-28T16:40:00',
    status: 'Finalizado',
    endereco: 'Av. Norte Miguel Arraes, 2000, Recife',
    latitude: -8.0284,
    longitude: -34.8949,
    vitimas: 0,
    tempoResposta: '7min'
  },
  {
    id: 12,
    tipo: 'Resgate',
    dataHora: '2025-04-29T02:15:00',
    status: 'Finalizado',
    endereco: 'Av. Guararapes, 500, Recife',
    latitude: -8.0616,
    longitude: -34.8776,
    vitimas: 1,
    tempoResposta: '10min'
  },
  // Novos registros gerados automaticamente (500 ocorrências)
  ...Array.from({ length: 200 }, (_, i) => {
    const id = i + 13; // Continuando a numeração
    const tipos = ['Incêndio', 'Acidente', 'Inundação', 'Resgate', 'Queda de Árvore', 'Desabamento', 'Emergência Médica'];
    const statusOptions = ['Em Andamento', 'Controlado', 'Finalizado'];
    const bairrosRecife = [
      'Boa Viagem', 'Boa Vista', 'Santo Amaro', 'Santo Antônio', 'São José', 
      'Pina', 'Imbiribeira', 'Afogados', 'Estância', 'Barro', 
      'Cordeiro', 'Encruzilhada', 'Casa Amarela', 'Tamarineira', 'Várzea',
      'Madalena', 'Parnamirim', 'Espinheiro', 'Graças', 'Aflitos'
    ];
    
    // Gera data/hora aleatória nos últimos 30 dias
    const dataHora = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    dataHora.setHours(Math.floor(Math.random() * 24));
    dataHora.setMinutes(Math.floor(Math.random() * 60));
    
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const vitimas = Math.floor(Math.random() * 5); // 0-4 vítimas
    const tempoResposta = `${Math.floor(Math.random() * 15) + 1}min`; // 1-15 minutos
    
    // Gera coordenadas dentro da área de Recife
    const latitude = -8.05 + (Math.random() * 0.1 - 0.05); // -8.00 a -8.10
    const longitude = -34.90 + (Math.random() * 0.1 - 0.05); // -34.85 a -34.95
    
    const numero = Math.floor(Math.random() * 3000) + 1;
    const bairro = bairrosRecife[Math.floor(Math.random() * bairrosRecife.length)];
    const endereco = `Av. ${['Conselheiro Aguiar', 'Recife', 'Conde da Boa Vista', 'Caxangá', 'Norte', 'Sul'][Math.floor(Math.random() * 6)]}, ${numero}, ${bairro}, Recife`;
    
    return {
      id,
      tipo,
      dataHora: dataHora.toISOString(),
      status,
      endereco,
      latitude: parseFloat(latitude.toFixed(4)),
      longitude: parseFloat(longitude.toFixed(4)),
      vitimas,
      tempoResposta
    };
  })];
