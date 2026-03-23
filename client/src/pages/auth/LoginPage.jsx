import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const boxStyle = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: 'linear-gradient(120deg, #f8fafc 0%, #e2e8f0 100%)',
  padding: '24px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(2, 6, 23, 0.12)',
  padding: '24px',
};

const inputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
  marginBottom: '14px',
  fontSize: '14px',
};

const buttonStyle = {
  width: '100%',
  border: 'none',
  borderRadius: '10px',
  padding: '11px 14px',
  fontWeight: 700,
  background: '#2563eb',
  color: '#ffffff',
  cursor: 'pointer',
};

export default function LoginPage() {
  const [email, setEmail] = useState('mahadi@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/provider/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={boxStyle}>
      <form style={cardStyle} onSubmit={onSubmit}>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>Provider Login</h2>
        <p style={{ marginTop: 0, color: '#475569' }}>Use demo credentials to continue.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        {error ? (
          <p style={{ marginTop: 0, marginBottom: 12, color: '#dc2626', fontWeight: 600 }}>{error}</p>
        ) : null}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
