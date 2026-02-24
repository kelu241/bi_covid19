const UserReports = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Relatórios de Usuários</h3>
      </div>
      <div className="card-body">
        <p>Estatísticas e atividades dos usuários.</p>
        
        <div className="row mb-3">
          <div className="col-sm-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader">Usuários Ativos</div>
                <div className="h2 mb-3">1.847</div>
                <div className="text-success">+3% esta semana</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader">Novos Cadastros</div>
                <div className="h2 mb-3">127</div>
                <div className="text-primary">Este mês</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader">Taxa de Retenção</div>
                <div className="h2 mb-3">94%</div>
                <div className="text-success">+1% vs mês anterior</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="alert alert-info">
          <strong>Insight:</strong> Crescimento consistente na base de usuários.
        </div>
      </div>
    </div>
  );
}

export default UserReports;