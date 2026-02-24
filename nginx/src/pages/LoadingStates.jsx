import React, { useState, useEffect } from 'react';

// Exemplo com diferentes estados de loading
const LoadingStatesExample = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Estados de loading separados
  const [usersLoading, setUsersLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  
  // Estados de erro
  const [usersError, setUsersError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [userDetailsError, setUserDetailsError] = useState(null);

  // Carregar usuários
  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Falha ao carregar usuários');
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // Carregar posts
  const loadPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      if (!response.ok) throw new Error('Falha ao carregar posts');
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setPostsError(error.message);
    } finally {
      setPostsLoading(false);
    }
  };

  // Carregar detalhes do usuário
  const loadUserDetails = async (userId) => {
    setUserDetailsLoading(true);
    setUserDetailsError(null);
    
    try {
      const [userResponse, albumsResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`)
      ]);
      
      if (!userResponse.ok || !albumsResponse.ok) {
        throw new Error('Falha ao carregar detalhes do usuário');
      }
      
      const user = await userResponse.json();
      const albums = await albumsResponse.json();
      
      setSelectedUser({ ...user, albums });
    } catch (error) {
      setUserDetailsError(error.message);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadUsers();
    loadPosts();
  }, []);

  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                Estados de Loading e Tratamento de Erros
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            {/* Coluna de usuários */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">Usuários</h3>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={loadUsers}
                    disabled={usersLoading}
                  >
                    {usersLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : null}
                    {usersLoading ? 'Carregando...' : 'Recarregar'}
                  </button>
                </div>
                <div className="card-body">
                  {usersError ? (
                    <div className="alert alert-danger">
                      <h4 className="alert-title">Erro!</h4>
                      <div className="text-muted">{usersError}</div>
                    </div>
                  ) : usersLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2 text-muted">Carregando usuários...</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {users.map(user => (
                        <button
                          key={user.id}
                          className={`list-group-item list-group-item-action ${
                            selectedUser?.id === user.id ? 'active' : ''
                          }`}
                          onClick={() => loadUserDetails(user.id)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm bg-primary text-white me-3">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold">{user.name}</div>
                              <div className="text-muted">{user.email}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna de posts */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">Posts Recentes</h3>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={loadPosts}
                    disabled={postsLoading}
                  >
                    {postsLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : null}
                    {postsLoading ? 'Carregando...' : 'Recarregar'}
                  </button>
                </div>
                <div className="card-body">
                  {postsError ? (
                    <div className="alert alert-warning">
                      <h4 className="alert-title">Atenção!</h4>
                      <div className="text-muted">{postsError}</div>
                    </div>
                  ) : postsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2 text-muted">Carregando posts...</p>
                    </div>
                  ) : (
                    <div className="space-y">
                      {posts.map(post => (
                        <div key={post.id} className="card card-sm">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-blue me-2">{post.id}</span>
                              <span className="text-muted">User {post.userId}</span>
                            </div>
                            <h4 className="card-title">{post.title}</h4>
                            <p className="text-muted mb-0">
                              {post.body.substring(0, 80)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna de detalhes do usuário */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Detalhes do Usuário</h3>
                </div>
                <div className="card-body">
                  {!selectedUser && !userDetailsLoading && !userDetailsError ? (
                    <div className="text-center py-4">
                      <div className="empty-icon mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <p className="text-muted">Selecione um usuário para ver os detalhes</p>
                    </div>
                  ) : userDetailsError ? (
                    <div className="alert alert-danger">
                      <h4 className="alert-title">Erro!</h4>
                      <div className="text-muted">{userDetailsError}</div>
                    </div>
                  ) : userDetailsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2 text-muted">Carregando detalhes...</p>
                    </div>
                  ) : selectedUser ? (
                    <div>
                      <div className="text-center mb-4">
                        <div className="avatar avatar-xl bg-success text-white mb-3">
                          {selectedUser.name.charAt(0)}
                        </div>
                        <h3 className="mb-1">{selectedUser.name}</h3>
                        <p className="text-muted">{selectedUser.username}</p>
                      </div>
                      
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <div className="text-muted">{selectedUser.email}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label className="form-label">Telefone</label>
                            <div className="text-muted">{selectedUser.phone}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <div className="text-muted">{selectedUser.website}</div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Empresa</label>
                        <div className="text-muted">{selectedUser.company?.name}</div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Álbuns</label>
                        <div className="badge bg-primary">{selectedUser.albums?.length || 0} álbuns</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingStatesExample;