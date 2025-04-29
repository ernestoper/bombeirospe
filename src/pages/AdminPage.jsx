import React, { useState } from 'react';
import Card from '../components/common/Card';

/**
 * Página de administração do sistema
 * Acessível apenas para usuários com permissão de admin
 */
function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  // Mock de dados de usuários
  const users = [
    { id: 1, name: 'Admin Principal', email: 'admin@cbmpe.gov.br', role: 'admin', status: 'active' },
    { id: 2, name: 'Operador 1', email: 'operador1@cbmpe.gov.br', role: 'operador', status: 'active' },
    { id: 3, name: 'Operador 2', email: 'operador2@cbmpe.gov.br', role: 'operador', status: 'active' },
    { id: 4, name: 'Analista 1', email: 'analista1@cbmpe.gov.br', role: 'operador', status: 'inactive' },
  ];

  // Mock de equipes
  const teams = [
    { id: 1, name: 'Equipe Alfa', members: 8, area: 'Zona Norte', status: 'active' },
    { id: 2, name: 'Equipe Beta', members: 6, area: 'Zona Sul', status: 'active' },
    { id: 3, name: 'Equipe Gama', members: 7, area: 'Zona Oeste', status: 'active' },
    { id: 4, name: 'Equipe Delta', members: 5, area: 'Centro', status: 'inactive' },
  ];

  // Mock de configurações do sistema
  const settings = [
    { id: 'notifications', name: 'Notificações', value: 'enabled' },
    { id: 'auto_assign', name: 'Atribuição Automática', value: 'disabled' },
    { id: 'retention', name: 'Retenção de Dados', value: '90 dias' },
    { id: 'backup', name: 'Backup Automático', value: 'daily' },
  ];

  return (
    <>
      {/* Tabs de navegação */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`${
              activeTab === 'teams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Equipes
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Logs do Sistema
          </button>
        </nav>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'users' && (
        <Card title="Gerenciamento de Usuários">
          <div className="flex justify-between items-center mb-4">
            <div>
              <input
                type="text"
                placeholder="Buscar usuários..."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
              />
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Adicionar Usuário
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Administrador' : 'Operador'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          {user.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'teams' && (
        <Card title="Gerenciamento de Equipes">
          <div className="flex justify-between items-center mb-4">
            <div>
              <input
                type="text"
                placeholder="Buscar equipes..."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
              />
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Adicionar Equipe
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membros
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.members}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.area}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          team.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {team.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          Editar
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card title="Configurações do Sistema">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Valor atual: <span className="font-medium">{setting.value}</span>
                  </p>
                </div>
                <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  Alterar
                </button>
              </div>
            ))}
            <div className="pt-4 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50">
                Restaurar Padrões
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                Salvar Alterações
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card title="Logs do Sistema">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-3">
              <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option>Todos os tipos</option>
                <option>Erros</option>
                <option>Avisos</option>
                <option>Info</option>
              </select>
              <input
                type="date"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <button className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
              Exportar Logs
            </button>
          </div>
          <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto">
            <div className="text-green-400">[2025-04-28 10:23:15] INFO: Sistema iniciado com sucesso</div>
            <div className="text-yellow-400">[2025-04-28 11:45:22] WARN: Tentativa de login falhou para usuário: usuario123</div>
            <div className="text-red-400">[2025-04-28 14:32:10] ERROR: Falha ao conectar ao servidor de mapas</div>
            <div className="text-blue-400">[2025-04-28 15:10:05] INFO: Nova ocorrência registrada #12458</div>
            <div className="text-blue-400">[2025-04-28 16:27:18] INFO: Usuário 'admin' alterou configurações do sistema</div>
            <div className="text-yellow-400">[2025-04-28 18:05:33] WARN: Uso de CPU acima de 80%</div>
            <div className="text-blue-400">[2025-04-29 08:15:42] INFO: Backup automático concluído</div>
            <div className="text-blue-400">[2025-04-29 09:30:11] INFO: Usuário 'operador1' gerou relatório #789</div>
            <div className="text-green-400">[2025-04-29 10:00:00] INFO: Rotina de limpeza de cache executada</div>
            <div className="text-red-400">[2025-04-29 11:23:45] ERROR: Falha ao processar imagem da ocorrência #12460</div>
          </div>
        </Card>
      )}
    </>
  );
}

export default AdminPage;