// src/data/mockOccurrences.js

/**
 * Dados mockados de ocorrências do CBMPE
 * 
 * Características:
 * - ~500 ocorrências distribuídas ao longo de 1 ano (365 dias)
 * - Distribuição temporal realista:
 *   - 40% nos últimos 30 dias
 *   - 30% entre 30-90 dias atrás
 *   - 30% entre 90-365 dias atrás
 * - Variação sazonal:
 *   - Verão (Dez-Mar): Mais incêndios
 *   - Inverno (Jun-Ago): Mais inundações e quedas de árvore
 * - Campos completos: equipes, viaturas, comandante, fotos, etc.
 */

// Função para gerar data recente (últimos 365 dias)
const getRecentDate = (daysAgo = 0, hoursAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockOccurrences = [
  // Ocorrências de HOJE (sempre atualizadas)
  {
    id: 1,
    tipo: 'Incêndio',
    subtipo: 'Residencial',
    prioridade: 'Alta',
    gravidade: 4,
    dataHora: getRecentDate(0, 2), // 2 horas atrás (HOJE)
    status: 'Em Andamento',
    endereco: 'Av. Boa Viagem, 1000, Recife',
    bairro: 'Boa Viagem',
    latitude: -8.1169,
    longitude: -34.8911,
    vitimas: 2,
    vitimasFatais: 0,
    tempoResposta: '5min',
    equipesEnvolvidas: ['Equipe Alpha', 'Equipe Bravo'],
    viaturasEnvolvidas: ['AB-01', 'AB-02'],
    comandante: 'Ten. Silva',
    observacoes: 'Incêndio em apartamento no 5º andar. Moradores evacuados.',
    progressoAtendimento: 65,
    recursosUtilizados: ['Água', 'Espuma', 'Escada Magirus'],
    fotos: [
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1595254758998-ea5a6c5c8e9f?w=400&h=300&fit=crop'
    ]
  },
  {
    id: 2,
    tipo: 'Acidente',
    subtipo: 'Trânsito',
    prioridade: 'Média',
    gravidade: 3,
    dataHora: getRecentDate(0, 4), // 4 horas atrás (HOJE)
    status: 'Controlado',
    endereco: 'Rua da Aurora, 500, Recife',
    bairro: 'Santo Amaro',
    latitude: -8.0576,
    longitude: -34.8811,
    vitimas: 2,
    vitimasFatais: 0,
    tempoResposta: '8min',
    equipesEnvolvidas: ['Equipe Charlie'],
    viaturasEnvolvidas: ['AS-03'],
    comandante: 'Sgt. Costa',
    observacoes: 'Colisão entre dois veículos. Vítimas encaminhadas ao hospital.',
    progressoAtendimento: 90,
    recursosUtilizados: ['Desencarceramento', 'Primeiros Socorros'],
    fotos: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
    ]
  },
  {
    id: 3,
    tipo: 'Inundação',
    subtipo: 'Urbana',
    prioridade: 'Baixa',
    gravidade: 2,
    dataHora: getRecentDate(1, 5), // 1 dia e 5 horas atrás
    status: 'Finalizado',
    endereco: 'Av. Agamenon Magalhães, 2000, Recife',
    bairro: 'Espinheiro',
    latitude: -8.0535,
    longitude: -34.8848,
    vitimas: 0,
    vitimasFatais: 0,
    tempoResposta: '12min',
    equipesEnvolvidas: ['Equipe Delta'],
    viaturasEnvolvidas: ['AB-04'],
    comandante: 'Cap. Oliveira',
    observacoes: 'Alagamento devido a chuva forte. Área isolada e drenada.',
    progressoAtendimento: 100,
    recursosUtilizados: ['Bomba de Água', 'Sinalização'],
    fotos: []
  },
  {
    id: 4,
    tipo: 'Incêndio',
    subtipo: 'Comercial',
    prioridade: 'Crítica',
    gravidade: 5,
    dataHora: getRecentDate(1, 9), // 1 dia e 9 horas atrás
    status: 'Finalizado',
    endereco: 'Rua do Bom Jesus, 100, Recife',
    bairro: 'Recife',
    latitude: -8.0636,
    longitude: -34.8716,
    vitimas: 1,
    vitimasFatais: 0,
    tempoResposta: '7min',
    equipesEnvolvidas: ['Equipe Alpha', 'Equipe Echo'],
    viaturasEnvolvidas: ['AB-01', 'AB-05'],
    comandante: 'Maj. Santos',
    observacoes: 'Incêndio em loja de tecidos. Grande quantidade de fumaça.',
    progressoAtendimento: 100,
    recursosUtilizados: ['Água', 'Espuma', 'Ventilação'],
    fotos: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
    ]
  },
  {
    id: 5,
    tipo: 'Resgate',
    subtipo: 'Altura',
    prioridade: 'Alta',
    gravidade: 4,
    dataHora: getRecentDate(0, 1), // 1 hora atrás (HOJE)
    status: 'Em Andamento',
    endereco: 'Av. Conde da Boa Vista, 1500, Recife',
    bairro: 'Boa Vista',
    latitude: -8.0623,
    longitude: -34.8871,
    vitimas: 1,
    vitimasFatais: 0,
    tempoResposta: '10min',
    equipesEnvolvidas: ['Equipe Foxtrot'],
    viaturasEnvolvidas: ['AS-06'],
    comandante: 'Ten. Almeida',
    observacoes: 'Trabalhador preso em andaime no 8º andar.',
    progressoAtendimento: 45,
    recursosUtilizados: ['Escada Magirus', 'Equipamento de Rapel'],
    fotos: []
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
    subtipo: 'Água',
    prioridade: 'Alta',
    gravidade: 4,
    dataHora: getRecentDate(0, 8), // 8 horas atrás (HOJE)
    status: 'Finalizado',
    endereco: 'Av. Guararapes, 500, Recife',
    bairro: 'Santo Antônio',
    latitude: -8.0616,
    longitude: -34.8776,
    vitimas: 1,
    vitimasFatais: 0,
    tempoResposta: '10min',
    equipesEnvolvidas: ['Equipe Golf'],
    viaturasEnvolvidas: ['AS-07'],
    comandante: 'Sgt. Martins',
    observacoes: 'Resgate de pessoa em área alagada.',
    progressoAtendimento: 100,
    recursosUtilizados: ['Bote', 'Equipamento de Flutuação'],
    fotos: []
  },
  // Mais ocorrências de HOJE
  {
    id: 13,
    tipo: 'Emergência Médica',
    subtipo: 'Trauma',
    prioridade: 'Crítica',
    gravidade: 5,
    dataHora: getRecentDate(0, 0.5), // 30 minutos atrás (AGORA!)
    status: 'Em Andamento',
    endereco: 'Rua da Aurora, 1200, Recife',
    bairro: 'Santo Amaro',
    latitude: -8.0580,
    longitude: -34.8820,
    vitimas: 1,
    vitimasFatais: 0,
    tempoResposta: '4min',
    equipesEnvolvidas: ['Equipe Hotel'],
    viaturasEnvolvidas: ['AS-08'],
    comandante: 'Ten. Rocha',
    observacoes: 'Vítima de queda. SAMU acionado.',
    progressoAtendimento: 30,
    recursosUtilizados: ['Primeiros Socorros', 'Imobilização'],
    fotos: []
  },
  {
    id: 14,
    tipo: 'Queda de Árvore',
    subtipo: 'Via Pública',
    prioridade: 'Média',
    gravidade: 2,
    dataHora: getRecentDate(0, 6), // 6 horas atrás (HOJE)
    status: 'Finalizado',
    endereco: 'Av. Rosa e Silva, 800, Recife',
    bairro: 'Aflitos',
    latitude: -8.0420,
    longitude: -34.9050,
    vitimas: 0,
    vitimasFatais: 0,
    tempoResposta: '15min',
    equipesEnvolvidas: ['Equipe India'],
    viaturasEnvolvidas: ['AB-06'],
    comandante: 'Sgt. Lima',
    observacoes: 'Árvore bloqueando via. Removida com sucesso.',
    progressoAtendimento: 100,
    recursosUtilizados: ['Motosserra', 'Equipamento de Proteção'],
    fotos: []
  },
  // Ocorrências de ONTEM
  {
    id: 15,
    tipo: 'Incêndio',
    subtipo: 'Veicular',
    prioridade: 'Alta',
    gravidade: 3,
    dataHora: getRecentDate(1, 3), // Ontem, 3 horas antes desta hora
    status: 'Finalizado',
    endereco: 'BR-101, Km 45, Recife',
    bairro: 'Imbiribeira',
    latitude: -8.1100,
    longitude: -34.9200,
    vitimas: 0,
    vitimasFatais: 0,
    tempoResposta: '8min',
    equipesEnvolvidas: ['Equipe Juliet'],
    viaturasEnvolvidas: ['AB-07'],
    comandante: 'Cap. Mendes',
    observacoes: 'Veículo em chamas na rodovia. Fogo controlado rapidamente.',
    progressoAtendimento: 100,
    recursosUtilizados: ['Espuma', 'Água'],
    fotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    ]
  },
  // Novos registros gerados automaticamente - 1 ano de dados (365 dias)
  // Gerando ~500 ocorrências distribuídas ao longo do ano
  ...Array.from({ length: 500 }, (_, i) => {
    const id = i + 16; // Começando após as ocorrências manuais
    
    const tiposConfig = {
      'Incêndio': { subtipos: ['Residencial', 'Comercial', 'Veicular', 'Florestal'], icon: '🔥' },
      'Acidente': { subtipos: ['Trânsito', 'Trabalho', 'Doméstico'], icon: '🚗' },
      'Resgate': { subtipos: ['Altura', 'Água', 'Espaço Confinado'], icon: '🆘' },
      'Inundação': { subtipos: ['Urbana', 'Rural'], icon: '🌊' },
      'Queda de Árvore': { subtipos: ['Via Pública', 'Residência'], icon: '🌳' },
      'Desabamento': { subtipos: ['Estrutural', 'Parcial'], icon: '🏚️' },
      'Emergência Médica': { subtipos: ['Trauma', 'Clínica'], icon: '🚑' }
    };
    
    const statusOptions = ['Em Andamento', 'Controlado', 'Finalizado'];
    const prioridadeOptions = ['Baixa', 'Média', 'Alta', 'Crítica'];
    const bairrosRecife = [
      'Boa Viagem', 'Boa Vista', 'Santo Amaro', 'Santo Antônio', 'São José', 
      'Pina', 'Imbiribeira', 'Afogados', 'Estância', 'Barro', 
      'Cordeiro', 'Encruzilhada', 'Casa Amarela', 'Tamarineira', 'Várzea',
      'Madalena', 'Parnamirim', 'Espinheiro', 'Graças', 'Aflitos'
    ];
    
    const equipesDisponiveis = ['Equipe Alpha', 'Equipe Bravo', 'Equipe Charlie', 'Equipe Delta', 'Equipe Echo', 'Equipe Foxtrot'];
    const viaturasDisponiveis = ['AB-01', 'AB-02', 'AB-03', 'AB-04', 'AB-05', 'AS-01', 'AS-02', 'AS-03'];
    const comandantes = ['Ten. Silva', 'Cap. Oliveira', 'Sgt. Costa', 'Maj. Santos', 'Ten. Almeida', 'Cap. Ferreira'];
    
    // Gera data/hora aleatória nos últimos 365 dias (1 ano)
    // Distribuição mais realista: mais ocorrências recentes
    // 40% nos últimos 30 dias, 30% nos últimos 90 dias, 30% no resto do ano
    let daysAgo;
    const rand = Math.random();
    if (rand < 0.4) {
      // 40% - Últimos 30 dias
      daysAgo = Math.floor(Math.random() * 30);
    } else if (rand < 0.7) {
      // 30% - Entre 30 e 90 dias
      daysAgo = Math.floor(Math.random() * 60) + 30;
    } else {
      // 30% - Entre 90 e 365 dias
      daysAgo = Math.floor(Math.random() * 275) + 90;
    }
    
    const hoursAgo = Math.floor(Math.random() * 24);
    const dataHora = getRecentDate(daysAgo, hoursAgo);
    
    // Variação sazonal baseada na data
    const dataOcorrencia = new Date(dataHora);
    const mes = dataOcorrencia.getMonth(); // 0-11
    
    // Ajustar probabilidades por estação
    let tipoKey;
    const randTipo = Math.random();
    
    // Verão (Dez-Mar): Mais incêndios
    if (mes >= 11 || mes <= 2) {
      if (randTipo < 0.35) tipoKey = 'Incêndio';
      else if (randTipo < 0.55) tipoKey = 'Acidente';
      else if (randTipo < 0.70) tipoKey = 'Resgate';
      else if (randTipo < 0.80) tipoKey = 'Emergência Médica';
      else tipoKey = Object.keys(tiposConfig)[Math.floor(Math.random() * Object.keys(tiposConfig).length)];
    }
    // Inverno (Jun-Ago): Mais inundações
    else if (mes >= 5 && mes <= 7) {
      if (randTipo < 0.30) tipoKey = 'Inundação';
      else if (randTipo < 0.50) tipoKey = 'Acidente';
      else if (randTipo < 0.70) tipoKey = 'Resgate';
      else if (randTipo < 0.85) tipoKey = 'Queda de Árvore';
      else tipoKey = Object.keys(tiposConfig)[Math.floor(Math.random() * Object.keys(tiposConfig).length)];
    }
    // Outras estações: Distribuição normal
    else {
      tipoKey = Object.keys(tiposConfig)[Math.floor(Math.random() * Object.keys(tiposConfig).length)];
    }
    
    const tipoInfo = tiposConfig[tipoKey];
    const subtipo = tipoInfo.subtipos[Math.floor(Math.random() * tipoInfo.subtipos.length)];
    
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const prioridade = prioridadeOptions[Math.floor(Math.random() * prioridadeOptions.length)];
    const gravidade = Math.floor(Math.random() * 5) + 1; // 1-5
    
    const vitimas = Math.floor(Math.random() * 5);
    const vitimasFatais = vitimas > 0 ? Math.floor(Math.random() * 2) : 0;
    const tempoResposta = `${Math.floor(Math.random() * 15) + 1}min`;
    
    // Progresso baseado no status
    let progressoAtendimento;
    if (status === 'Finalizado') progressoAtendimento = 100;
    else if (status === 'Controlado') progressoAtendimento = Math.floor(Math.random() * 20) + 70;
    else progressoAtendimento = Math.floor(Math.random() * 60) + 20;
    
    // Equipes (1-3 equipes)
    const numEquipes = Math.floor(Math.random() * 3) + 1;
    const equipesEnvolvidas = Array.from({ length: numEquipes }, () => 
      equipesDisponiveis[Math.floor(Math.random() * equipesDisponiveis.length)]
    );
    
    // Viaturas (1-2 viaturas)
    const numViaturas = Math.floor(Math.random() * 2) + 1;
    const viaturasEnvolvidas = Array.from({ length: numViaturas }, () => 
      viaturasDisponiveis[Math.floor(Math.random() * viaturasDisponiveis.length)]
    );
    
    const comandante = comandantes[Math.floor(Math.random() * comandantes.length)];
    
    // Gera coordenadas dentro da área de Recife
    const latitude = -8.05 + (Math.random() * 0.1 - 0.05);
    const longitude = -34.90 + (Math.random() * 0.1 - 0.05);
    
    const numero = Math.floor(Math.random() * 3000) + 1;
    const bairro = bairrosRecife[Math.floor(Math.random() * bairrosRecife.length)];
    const endereco = `Av. ${['Conselheiro Aguiar', 'Recife', 'Conde da Boa Vista', 'Caxangá', 'Norte', 'Sul'][Math.floor(Math.random() * 6)]}, ${numero}, ${bairro}, Recife`;
    
    const recursos = [
      ['Água', 'Espuma'],
      ['Desencarceramento', 'Primeiros Socorros'],
      ['Escada Magirus', 'Equipamento de Rapel'],
      ['Bomba de Água', 'Sinalização'],
      ['Motosserra', 'Equipamento de Proteção'],
      ['Escoras', 'Equipamento de Busca']
    ];
    const recursosUtilizados = recursos[Math.floor(Math.random() * recursos.length)];
    
    return {
      id,
      tipo: tipoKey,
      subtipo,
      prioridade,
      gravidade,
      dataHora,
      status,
      endereco,
      bairro,
      latitude: parseFloat(latitude.toFixed(4)),
      longitude: parseFloat(longitude.toFixed(4)),
      vitimas,
      vitimasFatais,
      tempoResposta,
      equipesEnvolvidas,
      viaturasEnvolvidas,
      comandante,
      observacoes: `${tipoKey} ${subtipo.toLowerCase()} atendido pela equipe.`,
      progressoAtendimento,
      recursosUtilizados,
      fotos: []
    };
  })];
