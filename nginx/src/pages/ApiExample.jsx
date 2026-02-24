import React, { useState, useEffect } from 'react';
import { fetchData, postData, updateData, deleteData } from '../services/api';

const ApiExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // Carregar usuários quando o componente montar
  useEffect(() => {
    loadUsers();
  }, []);

  // Função para carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchData('/users');
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar novo usuário
  const createUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email) {
      setError('Nome e email são obrigatórios');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const createdUser = await postData('/users', newUser);
      setUsers([...users, createdUser]);
      setNewUser({ name: '', email: '' });
      alert('Usuário criado com sucesso!');
    } catch (err) {
      setError('Erro ao criar usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar usuário
  const updateUser = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateData(`/users/${id}`, updatedData);
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...updatedUser } : user
      ));
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar usuário
  const removeUser = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await deleteData(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert('Usuário deletado com sucesso!');
    } catch (err) {
      setError('Erro ao deletar usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                Exemplo de Consumo de API
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Formulário para criar usuário */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Criar Novo Usuário</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={createUser}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Nome</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            placeholder="Digite o nome"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="Digite o email"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Criando...' : 'Criar Usuário'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary ms-2"
                        onClick={loadUsers}
                        disabled={loading}
                      >
                        {loading ? 'Carregando...' : 'Recarregar Lista'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Exibir erros */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Lista de usuários */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Lista de Usuários</h3>
                </div>
                <div className="card-body">
                  {loading && users.length === 0 ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th className="w-1">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.username}</td>
                              <td>
                                <div className="btn-list flex-nowrap">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => updateUser(user.id, {
                                      ...user,
                                      name: user.name + ' (Atualizado)'
                                    })}
                                    disabled={loading}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeUser(user.id)}
                                    disabled={loading}
                                  >
                                    Deletar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && !loading && (
                        <div className="text-center py-4">
                          <p className="text-muted">Nenhum usuário encontrado</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExample;