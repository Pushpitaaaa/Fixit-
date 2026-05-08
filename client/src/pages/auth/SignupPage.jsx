import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  marginTop: '10px',
};

const roleToggleContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  background: '#f1f5f9',
  padding: '6px',
  borderRadius: '12px',
};

const getRoleButtonStyle = (isActive) => ({
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  background: isActive ? '#ffffff' : 'transparent',
  color: isActive ? '#2563eb' : '#64748b',
  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
  transition: 'all 0.2s',
});

const linkContainerStyle = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#475569',
};

export default function SignupPage() {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = role === 'provider' ? '/auth/register/provider' : '/auth/register';
      const { data } = await api.post(endpoint, { name, email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={boxStyle}>
      <form style={cardStyle} onSubmit={onSubmit}>
        <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>Create an Account</h2>

        <div style={roleToggleContainerStyle}>
          <button 
            type="button" 
            style={getRoleButtonStyle(role === 'customer')}
            onClick={() => handleRoleChange('customer')}
          >
            Customer
          </button>
          <button 
            type="button" 
            style={getRoleButtonStyle(role === 'provider')}
            onClick={() => handleRoleChange('provider')}
          >
            Provider
          </button>
        </div>

        <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Full Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
          minLength="6"
        />

        {error ? (
          <p style={{ marginTop: 0, marginBottom: 12, color: '#dc2626', fontWeight: 600, fontSize: '14px' }}>{error}</p>
        ) : null}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div style={linkContainerStyle}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}
