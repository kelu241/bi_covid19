// Modelo de Atividade - para sua DataTable

// 1. Estrutura da atividade
export const ActivityModel = {
  id: null,
  data: '',
  usuario: '',
  acao: '',
  status: 'success', // 'success', 'warning', 'error'
  statusTexto: '',
  detalhes: '',
  timestamp: null
};

// 2. Factory function
export const createActivity = (data = {}) => ({
  ...ActivityModel,
  ...data,
  id: data.id || Date.now(),
  timestamp: data.timestamp || new Date().toISOString(),
  data: data.data || new Date().toLocaleDateString('pt-BR')
});

// 3. Status disponíveis
export const ActivityStatus = {
  SUCCESS: {
    key: 'success',
    text: 'Concluído',
    class: 'bg-success'
  },
  WARNING: {
    key: 'warning', 
    text: 'Processando',
    class: 'bg-warning'
  },
  ERROR: {
    key: 'error',
    text: 'Erro',
    class: 'bg-danger'
  },
  PENDING: {
    key: 'pending',
    text: 'Pendente', 
    class: 'bg-secondary'
  }
};

// 4. Tipos de ação
export const ActivityActions = {
  LOGIN: 'Login no sistema',
  LOGOUT: 'Logout do sistema',
  CREATE_USER: 'Cadastro de usuário',
  UPDATE_USER: 'Atualização de usuário',
  DELETE_USER: 'Exclusão de usuário',
  CREATE_PRODUCT: 'Cadastro de produto',
  UPDATE_PRODUCT: 'Atualização de produto',
  EXPORT_REPORT: 'Exportação de relatórios',
  IMPORT_DATA: 'Importação de dados'
};

// 5. Função para formatar atividade para exibição
export const formatActivityForDisplay = (activity) => ({
  ...activity,
  statusInfo: ActivityStatus[activity.status.toUpperCase()] || ActivityStatus.PENDING,
  dataFormatada: new Date(activity.timestamp || activity.data).toLocaleDateString('pt-BR'),
  tempoRelativo: getRelativeTime(activity.timestamp)
});

// 6. Função para tempo relativo
const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR');
};