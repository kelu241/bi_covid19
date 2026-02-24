const Settings = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Configurações do Sistema</h3>
      </div>
      <div className="card-body">
        <p>Configurações gerais da aplicação.</p>
        
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4>Preferências</h4>
                <p>Configurações de usuário e tema.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4>Sistema</h4>
                <p>Configurações técnicas e de segurança.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;