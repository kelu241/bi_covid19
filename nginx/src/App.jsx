
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './componentes/Layout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import TarefasReport from './pages/TarefasReport'
import UserReports from './pages/UserReports'
import Form from './pages/Form'
import LoadingStates from './pages/LoadingStates'
import { Toast } from './utils/Toast'


const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="reports" element={<Reports />} />
      <Route path="reports/tarefas" element={<TarefasReport />} />
      <Route path="reports/users" element={<UserReports />} />
      <Route path="users" element={<Users />} />
      <Route path="loading-states" element={<LoadingStates />} />
      <Route path="settings" element={<Settings />} />
      <Route path="form" element={<Form />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="register" element={<Form />} />
    </Routes>
    <Toast />
    </>
  )
}

export default App
