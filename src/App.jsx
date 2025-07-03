import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './pages/Layouts/MainLayout';

// Componentes que não precisam ser lazy loaded
import LoginPage from './pages/LoginPage';

// Lazy loading de componentes para melhor performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const OccurrencePage = lazy(() => import('./pages/OccurrencePage')); // Nova página

// Componente para rotas protegidas
const ProtectedRoute = ({ children, requiredRole = null, pageTitle = null }) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();
  
  // Se ainda está carregando, mostramos um loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Se a rota exige uma role específica e o usuário não tem permissão
  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  // Se passou por todas as verificações, renderiza o conteúdo dentro do layout principal
  return (
    <MainLayout pageTitle={pageTitle}>
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      }>
        {children}
      </Suspense>
    </MainLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública - Login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rota padrão - Dashboard (protegida) */}
          <Route path="/dashboard" element={
            <ProtectedRoute pageTitle="Dashboard Operacional">
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Rota de análise (protegida) */}
          <Route path="/analysis" element={
            <ProtectedRoute pageTitle="">
              <AnalysisPage />
            </ProtectedRoute>
          } />
          
          {/* Rota do mapa (protegida) */}
          <Route path="/map" element={
            <ProtectedRoute pageTitle="Mapa de Ocorrências">
              <MapPage />
            </ProtectedRoute>
          } />
          
          {/* Nova rota para registro de ocorrências */}
          <Route path="/occurrences" element={
            <ProtectedRoute pageTitle="Registro de Ocorrências">
              <OccurrencePage />
            </ProtectedRoute>
          } />
          
          {/* Rota de relatórios (protegida para operadores) */}
          <Route path="/reports" element={
            <ProtectedRoute requiredRole="operador" pageTitle="Relatórios">
              <ReportsPage />
            </ProtectedRoute>
          } />
          
          {/* Rota administrativa (protegida e com permissão específica) */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin" pageTitle="Administração do Sistema">
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* Redireciona a rota inicial para o dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota para páginas não encontradas */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen flex-col">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
              <button 
                onClick={() => window.history.back()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voltar
              </button>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;