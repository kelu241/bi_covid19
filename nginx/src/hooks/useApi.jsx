import React, { useState, useEffect } from 'react';

// Hook customizado para consumir APIs
const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  // Função para recarregar os dados
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook para POST requests
const usePostApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

// Exemplo de uso dos hooks
const HookExample = () => {
  // Usando o hook useApi para buscar dados
  const { 
    data: posts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = useApi('https://jsonplaceholder.typicode.com/posts?_limit=5');

  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError 
  } = useApi('https://jsonplaceholder.typicode.com/users?_limit=3');

  // Usando o hook usePostApi para criar dados
  const { postData, loading: postLoading, error: postError } = usePostApi();

  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    try {
      const result = await postData('https://jsonplaceholder.typicode.com/posts', {
        title: newPost.title,
        body: newPost.body,
        userId: 1,
      });
      
      alert('Post criado com sucesso! ID: ' + result.id);
      setNewPost({ title: '', body: '' });
      refetchPosts(); // Recarrega a lista de posts
    } catch (err) {
      console.error('Erro ao criar post:', err);
    }
  };

  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                Exemplo com Hooks Customizados
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Formulário para criar post */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Criar Novo Post</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleCreatePost}>
                    <div className="mb-3">
                      <label className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        placeholder="Digite o título"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Conteúdo</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newPost.body}
                        onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                        placeholder="Digite o conteúdo"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={postLoading}
                    >
                      {postLoading ? 'Criando...' : 'Criar Post'}
                    </button>
                  </form>
                  {postError && (
                    <div className="alert alert-danger mt-3">
                      Erro: {postError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Posts */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">Posts Recentes</h3>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={refetchPosts}
                    disabled={postsLoading}
                  >
                    {postsLoading ? 'Carregando...' : 'Recarregar'}
                  </button>
                </div>
                <div className="card-body">
                  {postsLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : postsError ? (
                    <div className="alert alert-danger">
                      Erro ao carregar posts: {postsError}
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {posts?.map(post => (
                        <div key={post.id} className="list-group-item">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="badge bg-primary">{post.id}</span>
                            </div>
                            <div className="col">
                              <h4 className="mb-1">{post.title}</h4>
                              <p className="text-muted mb-0">
                                {post.body.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Users */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Usuários</h3>
                </div>
                <div className="card-body">
                  {usersLoading ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : usersError ? (
                    <div className="alert alert-danger">
                      Erro: {usersError}
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {users?.map(user => (
                        <div key={user.id} className="list-group-item px-0">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar avatar-sm bg-primary text-white">
                                {user.name.charAt(0)}
                              </div>
                            </div>
                            <div className="col">
                              <div className="fw-bold">{user.name}</div>
                              <div className="text-muted">{user.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
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

export { useApi, usePostApi };
export default HookExample;