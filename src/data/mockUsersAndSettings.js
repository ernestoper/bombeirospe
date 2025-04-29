export const mockUsers = [
  {
    id: 1,
    nome: "Administrador Mestre",
    email: "admin@cbm.pe.gov.br",
    matricula: "12345",
    perfil: "Administrador",
    status: "Ativo",
    password: "admin123" // Apenas para simulação, NUNCA armazene senhas assim em produção
  },
  {
    id: 2,
    nome: "Operador Bombeiro Silva",
    email: "operador.silva@cbm.pe.gov.br",
    matricula: "54321",
    perfil: "Operador", // Perfil intermediário, pode ver tudo mas não gerencia usuários
    status: "Ativo",
    password: "operador123"
  },
  {
    id: 3,
    nome: "Usuário Público Teste",
    email: "publico@email.com",
    matricula: "99999",
    perfil: "Público", // Perfil limitado, pode ver dashboard público
    status: "Ativo",
    password: "publico123"
  },
  {
    id: 4,
    nome: "Analista Santos",
    email: "analista.santos@cbm.pe.gov.br",
    matricula: "67890",
    perfil: "Operador",
    status: "Ativo",
    password: "analista123"
  },
  {
    id: 5,
    nome: "Bombeiro Costa Inativo",
    email: "costa.inativo@cbm.pe.gov.br",
    matricula: "11223",
    perfil: "Operador",
    status: "Inativo",
    password: "inativo123"
  }
];

export const mockSystemSettings = {
  kpiRefreshRate: 60, // segundos
  mapDefaultZoom: 13,
  notificationSound: true,
};

export const mockAccessLogs = [
  { id: 1, userId: 1, timestamp: "2025-04-29T10:00:00", ipAddress: "192.168.1.10", action: "Login" },
  { id: 2, userId: 2, timestamp: "2025-04-29T09:45:00", ipAddress: "10.0.0.5", action: "Login" },
  { id: 3, userId: 1, timestamp: "2025-04-28T18:30:00", ipAddress: "192.168.1.10", action: "Editou Usuário ID 5" },
  { id: 4, userId: 3, timestamp: "2025-04-28T15:00:00", ipAddress: "200.100.50.25", action: "Login" },
  { id: 5, userId: 2, timestamp: "2025-04-28T11:00:00", ipAddress: "10.0.0.5", action: "Visualizou Análise Detalhada" },
];

