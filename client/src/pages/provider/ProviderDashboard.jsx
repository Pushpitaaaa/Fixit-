import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  addService,
  deleteService,
  editService,
  getDashboard,
  getEarnings,
  getPendingRequests,
  respondToBooking,
  toggleOpen,
  uploadPortfolioPhoto,
} from '../../services/api';
import styles from './ProviderDashboard.module.css';

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: '', description: '', price: '', category: '' }
  );

  useEffect(() => {
    setForm(initial || { title: '', description: '', price: '', category: '' });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.serviceForm}>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Service Title</span>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="Deep Cleaning"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Category</span>
          <input
            className={styles.input}
            type="text"
            name="category"
            placeholder="Cleaning"
            value={form.category}
            onChange={handleChange}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Price (BDT)</span>
        <input
          className={styles.input}
          type="number"
          name="price"
          placeholder="800"
          value={form.price}
          onChange={handleChange}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Service Description</span>
        <textarea
          className={styles.textarea}
          name="description"
          rows={4}
          placeholder="Describe your service quality, tools, and expected outcomes"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <div className={styles.formBtns}>
        <button type="button" className={styles.btnPrimary} onClick={() => onSave(form)}>
          Save
        </button>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const [provider, setProvider] = useState(null);
  const [pending, setPending] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [tab, setTab] = useState('services');
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [providerData, pendingData, earningsData] = await Promise.all([
          getDashboard(),
          getPendingRequests(),
          getEarnings('monthly'),
        ]);

        setProvider(providerData);
        setPending(pendingData);
        setEarnings(earningsData);
      } catch (error) {
        console.error('Failed to load provider dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleToggleOpen = async () => {
    const data = await toggleOpen();
    setProvider((prev) => ({ ...prev, isOpen: data.isOpen }));
  };

  const handleAddService = async (form) => {
    const services = await addService(form);
    setProvider((prev) => ({ ...prev, services }));
    setAddingNew(false);
  };

  const handleEditService = async (id, form) => {
    const services = await editService(id, form);
    setProvider((prev) => ({ ...prev, services }));
    setEditingId(null);
  };

  const handleDeleteService = async (id) => {
    const confirmed = window.confirm('Delete this service?');
    if (!confirmed) return;

    await deleteService(id);
    setProvider((prev) => ({
      ...prev,
      services: (prev.services || []).filter((service) => service._id !== id),
    }));
  };

  const handleRespond = async (bookingId, action) => {
    await respondToBooking(bookingId, action);
    setPending((prev) => prev.filter((booking) => booking._id !== bookingId));
  };

  const handlePeriodChange = async (p) => {
    setPeriod(p);
    const data = await getEarnings(p);
    setEarnings(data);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    const data = await uploadPortfolioPhoto(formData);
    setProvider((prev) => ({ ...prev, portfolio: data.portfolio }));
    e.target.value = '';
  };

  const summary = useMemo(() => {
    const total = earnings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const periods = earnings.length;
    const avg = periods ? total / periods : 0;

    return { total, periods, avg };
  }, [earnings]);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (!provider) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  const tabs = [
    { id: 'services', label: '🛠 Services' },
    { id: 'pending', label: `📋 Pending (${pending.length})` },
    { id: 'earnings', label: '💰 Earnings' },
    { id: 'portfolio', label: '🖼 Portfolio' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <div className={styles.providerInfo}>
          <img
            className={styles.providerAvatar}
            src={provider.user?.profilePic || 'https://via.placeholder.com/80'}
            alt={provider.user?.name || 'Provider'}
          />
          <div>
            <h2 className={styles.providerName}>{provider.user?.name}</h2>
            <p className={styles.providerEmail}>{provider.user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <div className={styles.toggleWrap}>
              <span className={styles.toggleLabel}>{provider.isOpen ? '🟢 Open' : '🔴 Closed'}</span>
              <button
                type="button"
                className={`${styles.toggleBtn} ${provider.isOpen ? styles.open : styles.closed}`}
                onClick={handleToggleOpen}
                aria-label="Toggle open status"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
            <p className={styles.toggleHint}>
              {provider.isOpen ? 'Visible in search' : 'Hidden from search'}
            </p>
          </div>

          <button 
            onClick={handleLogout} 
            className={styles.btnGhost} 
            style={{ color: '#dc2626', border: '1px solid #fca5a5', padding: '8px 16px' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.tab} ${tab === item.id ? styles.activeTab : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tab === 'services' && (
          <div>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>My Services</h3>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  setAddingNew(true);
                  setEditingId(null);
                }}
              >
                Add Service
              </button>
            </div>

            {addingNew && (
              <ServiceForm
                initial={null}
                onSave={handleAddService}
                onCancel={() => setAddingNew(false)}
              />
            )}

            <div className={styles.serviceList}>
              {(provider.services || []).map((service) => (
                <div key={service._id} className={styles.serviceCard}>
                  {editingId === service._id ? (
                    <ServiceForm
                      initial={service}
                      onSave={(form) => handleEditService(service._id, form)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <div className={styles.serviceInfo}>
                        <p className={styles.serviceCategory}>{service.category}</p>
                        <h4 className={styles.serviceTitle}>{service.title}</h4>
                        <p className={styles.serviceDesc}>{service.description}</p>
                        <p className={styles.servicePrice}>৳ {service.price}</p>
                      </div>
                      <div className={styles.serviceActions}>
                        <button
                          type="button"
                          className={styles.btnEdit}
                          onClick={() => {
                            setEditingId(service._id);
                            setAddingNew(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.btnDelete}
                          onClick={() => handleDeleteService(service._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pending' && (
          <div>
            <h3 className={styles.sectionTitle}>Pending Requests</h3>

            {pending.length === 0 ? (
              <p className={styles.empty}>No pending requests right now.</p>
            ) : (
              <div className={styles.pendingList}>
                {pending.map((booking) => (
                  <div key={booking._id} className={styles.pendingCard}>
                    <img
                      className={styles.custAvatar}
                      src={booking.customer?.profilePic || 'https://via.placeholder.com/80'}
                      alt={booking.customer?.name || 'Customer'}
                    />
                    <div className={styles.pendingInfo}>
                      <p className={styles.pendingCustomer}>{booking.customer?.name}</p>
                      <p className={styles.pendingService}>
                        {booking.service?.title || booking.serviceName || 'Service booking'}
                      </p>
                      <p className={styles.pendingDate}>
                        {booking.date || ''} {booking.timeSlot || ''}
                      </p>
                    </div>
                    <p className={styles.pendingAmount}>৳ {booking.totalAmount}</p>
                    <div className={styles.pendingActions}>
                      <button
                        type="button"
                        className={styles.btnAccept}
                        onClick={() => handleRespond(booking._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={styles.btnDecline}
                        onClick={() => handleRespond(booking._id, 'decline')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'earnings' && (
          <div>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Earnings</h3>
              <div className={styles.periodToggle}>
                <button
                  type="button"
                  className={period === 'daily' ? styles.periodActive : styles.periodBtn}
                  onClick={() => handlePeriodChange('daily')}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={period === 'monthly' ? styles.periodActive : styles.periodBtn}
                  onClick={() => handlePeriodChange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>

            {earnings.length === 0 ? (
              <p className={styles.empty}>No earnings data available yet.</p>
            ) : (
              <>
                <div className={styles.earningsSummary}>
                  <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Total</span>
                    <span className={styles.summaryValue}>৳ {summary.total.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Periods</span>
                    <span className={styles.summaryValue}>{summary.periods}</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Avg per period</span>
                    <span className={styles.summaryValue}>৳ {summary.avg.toFixed(2)}</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={earnings} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`৳ ${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        )}

        {tab === 'portfolio' && (
          <div>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Portfolio Photos</h3>
              <label htmlFor="portfolio-upload" className={styles.btnPrimary}>
                Upload Photo
              </label>
            </div>

            <input
              id="portfolio-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {(provider.portfolio || []).length === 0 ? (
              <p className={styles.empty}>No portfolio photos uploaded yet.</p>
            ) : (
              <div className={styles.photoGrid}>
                {provider.portfolio.map((url, idx) => (
                  <img key={`${url}-${idx}`} className={styles.photo} src={url} alt={`Portfolio ${idx + 1}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
