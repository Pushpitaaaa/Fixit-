import { Navigate, Route, Routes } from 'react-router-dom';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';

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
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/search/:keyword" element={<SearchPage />} />
      <Route path="/service/:id" element={<ServiceDetailsPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/provider/dashboard"
        element={
          <RequireAuth>
            <ProviderDashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}