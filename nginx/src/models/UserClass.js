// Modelo de Usuário - Versão com Classes ES6

// 1. Classe User
export class User {
  constructor(data = {}) {
    // Valores padrão (como seu UserModel)
    this.id = data.id || Date.now();
    this.nome = data.nome || '';
    this.email = data.email || '';
    this.senha = data.senha || '';
    this.telefone = data.telefone || '';
    this.cargo = data.cargo || '';
    this.ativo = data.ativo !== undefined ? data.ativo : false;
    this.dataCreated = data.dataCreated || new Date().toISOString();
    this.dataUpdated = new Date().toISOString();
  }

  // 2. Método de validação (instância)
  validate() {
    const errors = {};

    if (!this.nome?.trim()) {
      errors.nome = 'Nome é obrigatório';
    }

    if (!this.email?.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.email = 'Email inválido';
    }

    if (!this.senha || this.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!this.telefone?.trim()) {
      errors.telefone = 'Telefone é obrigatório';
    }

    if (!this.cargo?.trim()) {
      errors.cargo = 'Cargo é obrigatório';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // 3. Método para atualizar dados
  update(data) {
    Object.keys(data).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'dataCreated') {
        this[key] = data[key];
      }
    });
    this.dataUpdated = new Date().toISOString();
    return this;
  }

  // 4. Método para exibição
  getDisplayName() {
    return `${this.nome} (${this.email})`;
  }

  // 5. Método para opção de select
  toSelectOption() {
    return {
      value: this.id,
      label: this.getDisplayName()
    };
  }

  // 6. Método para serializar (para API)
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      telefone: this.telefone,
      cargo: this.cargo,
      ativo: this.ativo,
      dataCreated: this.dataCreated,
      dataUpdated: this.dataUpdated
    };
  }

  // 7. Método para clonar
  clone() {
    return new User(this.toJSON());
  }

  // 8. Método estático para criar múltiplos usuários
  static createMany(dataArray) {
    return dataArray.map(data => new User(data));
  }

  // 9. Método estático de validação (sem instância)
  static validate(userData) {
    const tempUser = new User(userData);
    return tempUser.validate();
  }
}

// 10. Constantes (mantém iguais)
export const UserStatus = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo', 
  PENDING: 'pendente'
};

export const UserRoles = {
  DEVELOPER: 'desenvolvedor',
  DESIGNER: 'designer',
  MANAGER: 'gerente',
  ANALYST: 'analista'
};