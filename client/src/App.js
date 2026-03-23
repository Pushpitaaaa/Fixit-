import { Navigate, Route, Routes } from 'react-router-dom';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import LoginPage from './pages/auth/LoginPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/provider/dashboard"
        element={
          <RequireAuth>
            <ProviderDashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
