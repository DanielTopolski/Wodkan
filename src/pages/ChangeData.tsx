import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

export default function ChangeData() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_street: '',
    address_city: '',
    address_postal_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address_street: profile.address_street || '',
        address_city: profile.address_city || '',
        address_postal_code: profile.address_postal_code || '',
      });
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user!.id, ...form, updated_at: new Date().toISOString() });

    if (error) {
      setError('Wystąpił błąd podczas zapisywania danych.');
    } else {
      setSuccess('Dane zostały pomyślnie zaktualizowane.');
      await refreshProfile();
    }
    setLoading(false);
  }

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };
  }

  return (
    <div>
      <div className="page-header">
        <h1>Zmiana danych</h1>
        <p>Zaktualizuj swoje dane kontaktowe i adresowe</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header"><h3>Dane osobowe i kontaktowe</h3></div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Imię</label>
                <input className="form-input" value={form.first_name} onChange={handleChange('first_name')} placeholder="Imię" />
              </div>
              <div className="form-group">
                <label className="form-label">Nazwisko</label>
                <input className="form-input" value={form.last_name} onChange={handleChange('last_name')} placeholder="Nazwisko" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Telefon kontaktowy</label>
              <input className="form-input" value={form.phone} onChange={handleChange('phone')} placeholder="np. 500 000 000" type="tel" />
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--neutral-600)', margin: '20px 0 12px' }}>Adres korespondencyjny</div>

            <div className="form-group">
              <label className="form-label">Ulica i numer</label>
              <input className="form-input" value={form.address_street} onChange={handleChange('address_street')} placeholder="np. ul. Kwiatowa 1/2" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Miasto</label>
                <input className="form-input" value={form.address_city} onChange={handleChange('address_city')} placeholder="np. Tarnobrzeg" />
              </div>
              <div className="form-group">
                <label className="form-label">Kod pocztowy</label>
                <input className="form-input" value={form.address_postal_code} onChange={handleChange('address_postal_code')} placeholder="np. 39-400" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Save size={15} />}
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
