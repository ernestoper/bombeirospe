import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { mockUsers } from '../../data/mockUsersAndSettings';

// Placeholder para Modal e Formulário de Usuário
const Modal = ({ children, title, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const UserForm = ({ initialData, onSave, onCancel }) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [matricula, setMatricula] = useState(initialData?.matricula || '');
  const [perfil, setPerfil] = useState(initialData?.perfil || 'Operador');
  const [status, setStatus] = useState(initialData?.status || 'Ativo');
  // Senha não deve ser editada diretamente aqui em um caso real

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...initialData, nome, email, matricula, perfil, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Matrícula</label>
        <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Perfil</label>
        <select value={perfil} onChange={e => setPerfil(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option>Administrador</option>
          <option>Operador</option>
          <option>Público</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

// Componente UserTable
function UserTable() {
  const [users, setUsers] = useState(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir/inativar este usuário? (Ação simulada)')) {
      console.log('Excluir/Inativar usuário:', userId);
      // Simulação: Apenas marca como inativo ou remove da lista localmente
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: 'Inativo' } : u));
      // Ou: setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    }
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      console.log('Editando usuário (simulado):', userData);
      setUsers(prevUsers => prevUsers.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser = { ...userData, id: Date.now(), password: 'tempPassword' }; // ID e senha simulados
      console.log('Adicionando usuário (simulado):', newUser);
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Gerenciamento de Usuários</h3>
        <Button onClick={handleAddUser}>
          {/* <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> */}
          Adicionar Usuário
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.matricula}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.perfil}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}>
        <UserForm initialData={editingUser} onSave={handleSaveUser} onCancel={() => setShowModal(false)} />
      </Modal>
    </Card>
  );
}

export default UserTable;

