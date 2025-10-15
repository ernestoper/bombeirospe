# 🔍 Análise de Lógica e Melhorias - CBMPE Dashboard

## 📊 Análise Completa da Implementação Atual

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Autenticação (AuthContext.jsx)**

#### ❌ Problemas:
1. **Credenciais hardcoded** - Senhas em texto plano no código
   ```javascript
   if (email === 'admin@cbmpe.gov.br' && password === 'senha123')
   ```
   
2. **Token falso** - Não há validação real
   ```javascript
   const token = 'jwt-token-simulado-' + Math.random()
   ```

3. **localStorage sem criptografia** - Dados sensíveis expostos
   ```javascript
   localStorage.setItem('cbmpe_user', JSON.stringify(userData))
   ```

4. **Sem expiração de sessão** - Token nunca expira

5. **Sem refresh token** - Usuário precisa fazer login novamente

6. **Sem proteção CSRF** - Vulnerável a ataques

#### ✅ Soluções Recomendadas:

```javascript
// 1. Usar variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL;

// 2. Implementar login real com API
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
      // Armazenar token com expiração
      const expiresAt = Date.now() + (data.expiresIn * 1000);
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiry', expiresAt);
      
      // Criptografar dados sensíveis
      const encryptedUser = encryptData(data.user);
      localStorage.setItem('user', encryptedUser);
      
      return { success: true };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 3. Verificar expiração do token
const isTokenValid = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  return expiry && Date.now() < parseInt(expiry);
};

// 4. Implementar refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  // Chamar API para renovar token
};
```

---

### 2. **Dados Mockados (mockOccurrences.js)**

#### ❌ Problemas:
1. **Dados estáticos** - Não refletem realidade
2. **Sem validação** - Campos podem estar vazios
3. **Datas fixas** - Sempre mostram datas antigas
4. **Sem relacionamentos** - Falta dados de equipes, viaturas
5. **Coordenadas aleatórias** - Não correspondem aos endereços reais

#### ✅ Soluções Recomendadas:

```javascript
// 1. Adicionar mais campos realistas
export const mockOccurrences = [
  {
    id: 1,
    tipo: 'Incêndio',
    subtipo: 'Residencial',
    dataHora: new Date().toISOString(), // Data atual
    status: 'Em Andamento',
    prioridade: 'Alta', // NOVO
    endereco: 'Av. Boa Viagem, 1000, Recife',
    bairro: 'Boa Viagem', // NOVO
    cep: '51020-000', // NOVO
    latitude: -8.1169,
    longitude: -34.8911,
    vitimas: 0,
    vitimasFatais: 0, // NOVO
    tempoResposta: '5min',
    tempoChegada: '2025-04-29T08:35:00', // NOVO
    equipesEnvolvidas: ['Equipe Alpha', 'Equipe Bravo'], // NOVO
    viaturasEnvolvidas: ['AB-01', 'AB-02'], // NOVO
    comandante: 'Ten. Silva', // NOVO
    observacoes: 'Incêndio em apartamento no 5º andar', // NOVO
    fotos: [], // NOVO
    gravidade: 'Média', // NOVO - Baixa, Média, Alta, Crítica
    causaProvavel: 'Curto-circuito', // NOVO
    danosMateriais: 'R$ 50.000,00', // NOVO
    areAatingida: '80m²', // NOVO
  }
];

// 2. Função para gerar dados mais realistas
const generateRealisticOccurrence = (id) => {
  const tipos = {
    'Incêndio': ['Residencial', 'Comercial', 'Veicular', 'Florestal'],
    'Acidente': ['Trânsito', 'Trabalho', 'Doméstico'],
    'Resgate': ['Altura', 'Água', 'Espaço Confinado'],
    'Inundação': ['Urbana', 'Rural'],
  };
  
  const tipo = Object.keys(tipos)[Math.floor(Math.random() * 4)];
  const subtipo = tipos[tipo][Math.floor(Math.random() * tipos[tipo].length)];
  
  // Gerar data realista (últimos 7 dias)
  const dataHora = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  
  return {
    id,
    tipo,
    subtipo,
    dataHora: dataHora.toISOString(),
    // ... resto dos campos
  };
};
```

---

### 3. **Dashboard (DashboardPage.jsx)**

#### ❌ Problemas:
1. **Cálculo de KPIs ineficiente** - Recalcula a cada render
2. **Sem cache** - Dados são reprocessados constantemente
3. **Sem paginação** - Carrega todas as ocorrências
4. **Sem filtros persistentes** - Filtros se perdem ao navegar
5. **Sem atualização em tempo real** - Dados estáticos

#### ✅ Soluções Recomendadas:

```javascript
import { useMemo, useCallback } from 'react';

function DashboardPage() {
  // 1. Usar useMemo para cálculos pesados
  const kpis = useMemo(() => calculateKPIs(occurrences), [occurrences]);
  
  // 2. Usar useCallback para funções
  const handleSelectOccurrence = useCallback((occurrence) => {
    setSelectedOccurrence(occurrence);
  }, []);
  
  // 3. Implementar paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedOccurrences = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return occurrences.slice(start, start + itemsPerPage);
  }, [occurrences, page]);
  
  // 4. Implementar atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Buscar novos dados da API
      fetchOccurrences();
    }, 30000); // A cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  // 5. Persistir filtros no localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('dashboardFilters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('dashboardFilters', JSON.stringify(filters));
  }, [filters]);
}
```

---

## 🟡 PROBLEMAS DE PERFORMANCE

### 1. **Re-renders Desnecessários**

#### ❌ Problema:
Componentes re-renderizam mesmo quando dados não mudam

#### ✅ Solução:
```javascript
// Usar React.memo para componentes puros
export const KPICard = React.memo(({ title, value, icon }) => {
  return (
    // ... componente
  );
});

// Usar useMemo para dados derivados
const filteredData = useMemo(() => {
  return data.filter(item => item.status === 'active');
}, [data]);
```

### 2. **Mapas Pesados**

#### ❌ Problema:
Renderizar 100+ marcadores no mapa causa lag

#### ✅ Solução:
```javascript
// 1. Usar clustering de marcadores
import MarkerClusterGroup from 'react-leaflet-markercluster';

<MarkerClusterGroup>
  {occurrences.map(occ => (
    <Marker key={occ.id} position={[occ.latitude, occ.longitude]} />
  ))}
</MarkerClusterGroup>

// 2. Virtualização - mostrar apenas marcadores visíveis
const visibleMarkers = useMemo(() => {
  return occurrences.filter(occ => 
    isInViewport(occ.latitude, occ.longitude, mapBounds)
  );
}, [occurrences, mapBounds]);
```

### 3. **Gráficos Pesados**

#### ❌ Problema:
Recharts re-renderiza gráficos complexos constantemente

#### ✅ Solução:
```javascript
// Usar ResponsiveContainer com debounce
import { debounce } from 'lodash';

const debouncedResize = useMemo(
  () => debounce(() => setSize(getSize()), 300),
  []
);
```

---

## 🟢 MELHORIAS DE ARQUITETURA

### 1. **Separar Lógica de Negócio**

#### Criar Services
```javascript
// src/services/occurrenceService.js
export const occurrenceService = {
  getAll: async () => {
    const response = await fetch('/api/occurrences');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`/api/occurrences/${id}`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch('/api/occurrences', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  calculateKPIs: (occurrences) => {
    // Lógica de cálculo
  }
};
```

### 2. **Usar React Query para Cache**

```javascript
import { useQuery, useMutation } from '@tanstack/react-query';

function DashboardPage() {
  // Cache automático, refetch, loading states
  const { data: occurrences, isLoading } = useQuery({
    queryKey: ['occurrences'],
    queryFn: occurrenceService.getAll,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch a cada 1 minuto
  });
  
  const mutation = useMutation({
    mutationFn: occurrenceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['occurrences']);
    }
  });
}
```

### 3. **Implementar Estado Global com Zustand**

```javascript
// src/stores/occurrenceStore.js
import create from 'zustand';

export const useOccurrenceStore = create((set) => ({
  occurrences: [],
  filters: {},
  selectedOccurrence: null,
  
  setOccurrences: (occurrences) => set({ occurrences }),
  setFilters: (filters) => set({ filters }),
  selectOccurrence: (id) => set((state) => ({
    selectedOccurrence: state.occurrences.find(o => o.id === id)
  })),
  
  // Ações computadas
  getActiveOccurrences: () => {
    return get().occurrences.filter(o => o.status !== 'Finalizado');
  }
}));
```

---

## 🔵 MELHORIAS DE UX/UI

### 1. **Loading States**

```javascript
function DashboardPage() {
  const { data, isLoading, error } = useQuery(['occurrences']);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <p className="ml-4 text-gray-600">Carregando dados...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erro ao carregar dados: {error.message}</p>
        <button onClick={() => refetch()}>Tentar novamente</button>
      </div>
    );
  }
  
  return (
    // ... conteúdo
  );
}
```

### 2. **Skeleton Loading**

```javascript
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg p-6">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

### 3. **Toast Notifications**

```javascript
import { toast } from 'sonner';

const handleSave = async () => {
  try {
    await saveOccurrence(data);
    toast.success('Ocorrência salva com sucesso!');
  } catch (error) {
    toast.error('Erro ao salvar ocorrência');
  }
};
```

---

## 🎯 MELHORIAS DE VALIDAÇÃO

### 1. **Validação de Formulários com Zod**

```javascript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const occurrenceSchema = z.object({
  tipo: z.enum(['Incêndio', 'Acidente', 'Resgate', 'Inundação']),
  endereco: z.string().min(10, 'Endereço muito curto'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  vitimas: z.number().min(0),
  dataHora: z.string().datetime(),
});

function OccurrenceForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(occurrenceSchema)
  });
  
  const onSubmit = (data) => {
    // Dados já validados
  };
}
```

---

## 📊 MELHORIAS DE DADOS

### 1. **Normalização de Dados**

```javascript
// Ao invés de:
const occurrences = [
  { id: 1, equipesEnvolvidas: ['Equipe Alpha', 'Equipe Bravo'] }
];

// Usar:
const occurrences = [
  { id: 1, equipesIds: [1, 2] }
];

const equipes = {
  1: { id: 1, nome: 'Equipe Alpha', membros: [...] },
  2: { id: 2, nome: 'Equipe Bravo', membros: [...] }
};
```

### 2. **Adicionar Timestamps**

```javascript
{
  id: 1,
  createdAt: '2025-04-29T08:30:00Z',
  updatedAt: '2025-04-29T08:35:00Z',
  createdBy: 'user123',
  updatedBy: 'user456'
}
```

---

## 🔒 MELHORIAS DE SEGURANÇA

### 1. **Sanitização de Inputs**

```javascript
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### 2. **Rate Limiting**

```javascript
// Limitar requisições por usuário
const rateLimiter = {
  requests: {},
  limit: 100, // 100 requisições
  window: 60000, // por minuto
  
  check: (userId) => {
    const now = Date.now();
    if (!this.requests[userId]) {
      this.requests[userId] = [];
    }
    
    // Remover requisições antigas
    this.requests[userId] = this.requests[userId].filter(
      time => now - time < this.window
    );
    
    if (this.requests[userId].length >= this.limit) {
      return false; // Bloqueado
    }
    
    this.requests[userId].push(now);
    return true; // Permitido
  }
};
```

---

## 📈 PRIORIDADES DE IMPLEMENTAÇÃO

### 🔴 Alta Prioridade (Crítico)
1. ✅ Implementar autenticação real com API
2. ✅ Adicionar validação de formulários
3. ✅ Implementar tratamento de erros
4. ✅ Adicionar loading states
5. ✅ Corrigir problemas de performance

### 🟡 Média Prioridade (Importante)
1. ✅ Implementar React Query para cache
2. ✅ Adicionar paginação
3. ✅ Implementar filtros persistentes
4. ✅ Melhorar dados mockados
5. ✅ Adicionar toast notifications

### 🟢 Baixa Prioridade (Desejável)
1. ✅ Implementar estado global com Zustand
2. ✅ Adicionar skeleton loading
3. ✅ Normalizar estrutura de dados
4. ✅ Implementar rate limiting
5. ✅ Adicionar mais campos aos dados

---

## 📝 CHECKLIST DE MELHORIAS

- [ ] Autenticação real implementada
- [ ] Validação de formulários com Zod
- [ ] React Query configurado
- [ ] Loading states em todos os componentes
- [ ] Tratamento de erros global
- [ ] Toast notifications
- [ ] Paginação implementada
- [ ] Filtros persistentes
- [ ] Performance otimizada (useMemo, useCallback)
- [ ] Dados mockados melhorados
- [ ] Testes unitários adicionados
- [ ] Documentação atualizada

---

**Data da Análise**: 15/10/2025
**Próximo Passo**: Implementar melhorias de alta prioridade
