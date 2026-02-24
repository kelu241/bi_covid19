const Products = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Gestão de Produtos</h3>
      </div>
      <div className="card-body">
        <p>Página para gerenciar produtos do sistema.</p>
        <div className="alert alert-success">
          <strong>Funcionalidades:</strong> Cadastro, edição e exclusão de produtos.
        </div>
      </div>
    </div>
  );
}

export default Products;