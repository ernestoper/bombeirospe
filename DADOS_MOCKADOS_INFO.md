# 📊 Informações sobre Dados Mockados

## 🎯 Características dos Dados

### Quantidade Total
- **~515 ocorrências** no total
- **15 ocorrências manuais** (detalhadas e realistas)
- **500 ocorrências geradas automaticamente**

---

## 📅 Distribuição Temporal

### Sempre Atualizado! ✅
Os dados são **sempre relativos à data/hora atual**:
- Se você abrir hoje (15/10/2025), os dados vão de 15/10/2024 até 15/10/2025
- Se abrir amanhã (16/10/2025), os dados vão de 16/10/2024 até 16/10/2025
- **Sempre 1 ano de histórico até o momento atual**

### Ocorrências Recentes (Sempre Atualizadas)
- **30 minutos atrás**: Emergência Médica em andamento
- **1 hora atrás**: Resgate em altura em andamento
- **2 horas atrás**: Incêndio residencial em andamento
- **4 horas atrás**: Acidente de trânsito controlado
- **6 horas atrás**: Queda de árvore finalizada
- **8 horas atrás**: Resgate em água finalizado
- **Ontem**: Incêndio veicular finalizado

### Distribuição ao Longo do Ano
```
Últimos 30 dias:    40% (~200 ocorrências) ████████
30-90 dias atrás:   30% (~150 ocorrências) ██████
90-365 dias atrás:  30% (~150 ocorrências) ██████
```

---

## 🌡️ Variação Sazonal (Realista)

### Verão (Dezembro - Março)
- 🔥 **35%** Incêndios (mais comum)
- 🚗 20% Acidentes
- 🆘 15% Resgates
- 🚑 15% Emergências Médicas
- 🌊 5% Inundações
- 🌳 5% Quedas de árvore
- 🏚️ 5% Desabamentos

### Inverno (Junho - Agosto)
- 🌊 **30%** Inundações (mais comum)
- 🌳 **15%** Quedas de árvore (mais comum)
- 🚗 20% Acidentes
- 🆘 15% Resgates
- 🔥 10% Incêndios
- 🚑 5% Emergências Médicas
- 🏚️ 5% Desabamentos

### Outras Estações
- Distribuição equilibrada entre todos os tipos

---

## 📋 Campos Disponíveis

Cada ocorrência tem:

### Básicos
- `id` - Identificador único
- `tipo` - Tipo principal (Incêndio, Acidente, etc.)
- `subtipo` - Subtipo específico (Residencial, Trânsito, etc.)
- `dataHora` - Data/hora da ocorrência (ISO 8601)
- `status` - Em Andamento, Controlado, Finalizado

### Localização
- `endereco` - Endereço completo
- `bairro` - Bairro de Recife
- `latitude` - Coordenada GPS
- `longitude` - Coordenada GPS

### Gravidade
- `prioridade` - Baixa, Média, Alta, Crítica
- `gravidade` - Escala 1-5

### Vítimas
- `vitimas` - Número de vítimas
- `vitimasFatais` - Número de fatalidades

### Operacional
- `tempoResposta` - Tempo até chegada (ex: "5min")
- `equipesEnvolvidas` - Array de equipes (ex: ['Equipe Alpha'])
- `viaturasEnvolvidas` - Array de viaturas (ex: ['AB-01'])
- `comandante` - Nome do comandante
- `progressoAtendimento` - Percentual 0-100%
- `recursosUtilizados` - Array de recursos (ex: ['Água', 'Espuma'])

### Extras
- `observacoes` - Descrição textual
- `fotos` - Array de URLs de fotos (algumas ocorrências)

---

## 🎨 Exemplos de Uso

### Filtrar Ocorrências de Hoje
```javascript
const hoje = new Date().toISOString().split('T')[0];
const ocorrenciasHoje = mockOccurrences.filter(occ => 
  occ.dataHora.startsWith(hoje)
);
```

### Filtrar por Tipo
```javascript
const incendios = mockOccurrences.filter(occ => 
  occ.tipo === 'Incêndio'
);
```

### Filtrar Últimos 7 Dias
```javascript
const seteDiasAtras = new Date();
seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

const ultimaSemana = mockOccurrences.filter(occ => 
  new Date(occ.dataHora) >= seteDiasAtras
);
```

### Agrupar por Bairro
```javascript
const porBairro = mockOccurrences.reduce((acc, occ) => {
  const bairro = occ.bairro || 'Não informado';
  acc[bairro] = (acc[bairro] || 0) + 1;
  return acc;
}, {});
```

### Calcular Média de Tempo de Resposta
```javascript
const tempos = mockOccurrences
  .map(occ => parseInt(occ.tempoResposta))
  .filter(t => !isNaN(t));

const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
```

---

## 🔄 Como os Dados São Gerados

### Função Principal
```javascript
const getRecentDate = (daysAgo = 0, hoursAgo = 0) => {
  const date = new Date(); // ← SEMPRE a data atual!
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};
```

### Exemplo
Se hoje é **15/10/2025 às 14:00**:
- `getRecentDate(0, 2)` → 15/10/2025 às 12:00 (2h atrás)
- `getRecentDate(1, 0)` → 14/10/2025 às 14:00 (ontem)
- `getRecentDate(7, 0)` → 08/10/2025 às 14:00 (semana passada)
- `getRecentDate(365, 0)` → 15/10/2024 às 14:00 (1 ano atrás)

---

## 💡 Dicas para Apresentação

### Mostre Dados Recentes
- Sempre há ocorrências de **hoje** e **ontem**
- Algumas estão **em andamento** (realismo!)
- Progresso de atendimento visível

### Demonstre Tendências
- Compare mês atual vs mês anterior
- Mostre sazonalidade (verão vs inverno)
- Identifique bairros críticos

### Destaque Recursos
- Equipes e viaturas em campo
- Tempo médio de resposta
- Taxa de sucesso (finalizadas)

---

## 🎯 Benefícios para POC

✅ **Sempre atualizado** - Dados relativos ao dia atual
✅ **Realista** - Variação sazonal e distribuição temporal
✅ **Completo** - Todos os campos necessários
✅ **Volumoso** - 500+ ocorrências para análises
✅ **Diversificado** - 7 tipos diferentes de ocorrências
✅ **Geolocalizado** - Coordenadas reais de Recife

---

**Última atualização**: 15/10/2025
**Versão dos dados**: 2.0 (1 ano de histórico)
