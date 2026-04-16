import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { ServicePoint, Meter } from '../types';
import { TriangleAlert as AlertTriangle, Send, CircleCheck as CheckCircle } from 'lucide-react';

interface ServicePointWithMeters extends ServicePoint {
  meters: Meter[];
}

const defectTypes = [
  { value: 'water_leak', label: 'Wyciek wody', requiresMeter: true },
  { value: 'no_water', label: 'Brak wody', requiresMeter: false },
  { value: 'low_pressure', label: 'Niskie ciśnienie wody', requiresMeter: false },
  { value: 'water_quality', label: 'Zła jakość wody', requiresMeter: false },
  { value: 'meter_damage', label: 'Uszkodzenie licznika', requiresMeter: true },
  { value: 'sewage_overflow', label: 'Przelanie ścieków', requiresMeter: false },
  { value: 'sewage_blockage', label: 'Zablokowanie kanalizacji', requiresMeter: false },
  { value: 'other', label: 'Inne', requiresMeter: false },
];

export default function DefectReport() {
  const { user, profile } = useAuth();
  const [points, setPoints] = useState<ServicePointWithMeters[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    defect_type: '',
    service_point_id: '',
    meter_id: '',
    defect_date: new Date().toISOString().split('T')[0],
    contact_name: '',
    contact_phone: '',
    address_city: '',
    address_street: '',
    address_house_number: '',
    description: '',
  });

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('service_points')
        .select('*, meters(*)')
        .eq('user_id', user.id);
      setPoints((data as ServicePointWithMeters[]) || []);

      if (profile) {
        setForm(prev => ({
          ...prev,
          contact_name: `${profile.first_name} ${profile.last_name}`.trim(),
          contact_phone: profile.phone || '',
        }));
      }
      setLoadingData(false);
    }
    load();
  }, [user, profile]);

  const selectedType = defectTypes.find(t => t.value === form.defect_type);
  const requiresMeter = selectedType?.requiresMeter ?? false;
  const availableMeters = points.find(p => p.id === form.service_point_id)?.meters || [];

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.defect_type) { setError('Wybierz rodzaj awarii.'); return; }
    if (!form.contact_name) { setError('Podaj imię i nazwisko.'); return; }
    if (!form.contact_phone) { setError('Podaj telefon kontaktowy.'); return; }
    if (!form.description) { setError('Opisz awarię.'); return; }
    if (new Date(form.defect_date) > new Date()) { setError('Data zgłoszenia nie może być z przyszłości.'); return; }

    setLoading(true);

    const payload: Record<string, unknown> = {
      user_id: user!.id,
      defect_type: form.defect_type,
      defect_date: form.defect_date,
      contact_name: form.contact_name,
      contact_phone: form.contact_phone,
      address_city: form.address_city,
      address_street: form.address_street,
      address_house_number: form.address_house_number,
      description: form.description,
      status: 'reported',
    };

    if (form.service_point_id) payload.service_point_id = form.service_point_id;
    if (form.meter_id && requiresMeter) payload.meter_id = form.meter_id;

    const { error } = await supabase.from('defect_reports').insert(payload);

    if (error) setError('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.');
    else setSubmitted(true);

    setLoading(false);
  }

  if (submitted) {
    return (
      <div>
        <div className="page-header"><h1>Zgłoś awarię</h1></div>
        <div className="card" style={{ maxWidth: 500, textAlign: 'center' }}>
          <div className="card-body" style={{ padding: '48px 24px' }}>
            <CheckCircle size={56} color="var(--success-700)" style={{ marginBottom: 16 }} />
            <h2 style={{ marginBottom: 8 }}>Zgłoszenie przyjęte</h2>
            <p style={{ color: 'var(--neutral-500)', marginBottom: 24 }}>
              Twoje zgłoszenie zostało zarejestrowane. Nasz zespół skontaktuje się z Tobą wkrótce.
            </p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Wyślij kolejne zgłoszenie</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Zgłoś awarię</h1>
        <p>Formularz zgłoszenia awarii lub usterki</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="var(--warning-600)" />
            <h3>Formularz zgłoszenia awarii</h3>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          {loadingData ? (
            <div className="loading-screen" style={{ height: 'auto', padding: '30px' }}><div className="spinner" /></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--neutral-600)', marginBottom: 12 }}>Rodzaj awarii</div>

              <div className="form-group">
                <label className="form-label">Typ awarii *</label>
                <select className="form-select" value={form.defect_type} onChange={handleChange('defect_type')} required>
                  <option value="">— Wybierz rodzaj awarii —</option>
                  {defectTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {points.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Punkt usług</label>
                  <select className="form-select" value={form.service_point_id} onChange={e => { setForm(prev => ({ ...prev, service_point_id: e.target.value, meter_id: '' })); }}>
                    <option value="">— Wybierz punkt usług (opcjonalnie) —</option>
                    {points.map(p => (
                      <option key={p.id} value={p.id}>{p.point_name || p.point_code}</option>
                    ))}
                  </select>
                </div>
              )}

              {requiresMeter && form.service_point_id && availableMeters.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Licznik</label>
                  <select className="form-select" value={form.meter_id} onChange={handleChange('meter_id')}>
                    <option value="">— Wybierz licznik —</option>
                    {availableMeters.map(m => (
                      <option key={m.id} value={m.id}>{m.meter_number}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Data wystąpienia awarii *</label>
                <input type="date" className="form-input" value={form.defect_date} max={new Date().toISOString().split('T')[0]} onChange={handleChange('defect_date')} required />
              </div>

              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--neutral-600)', margin: '20px 0 12px' }}>Dane kontaktowe</div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Imię i nazwisko *</label>
                  <input type="text" className="form-input" value={form.contact_name} onChange={handleChange('contact_name')} placeholder="Jan Kowalski" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon kontaktowy *</label>
                  <input type="tel" className="form-input" value={form.contact_phone} onChange={handleChange('contact_phone')} placeholder="500 000 000" required />
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--neutral-600)', margin: '8px 0 12px' }}>Miejsce awarii</div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Miasto</label>
                  <input type="text" className="form-input" value={form.address_city} onChange={handleChange('address_city')} placeholder="Tarnobrzeg" />
                </div>
                <div className="form-group">
                  <label className="form-label">Ulica</label>
                  <input type="text" className="form-input" value={form.address_street} onChange={handleChange('address_street')} placeholder="ul. Przykładowa" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Numer budynku/lokalu</label>
                <input type="text" className="form-input" value={form.address_house_number} onChange={handleChange('address_house_number')} placeholder="np. 1A/2" style={{ maxWidth: 200 }} />
              </div>

              <div className="form-group">
                <label className="form-label">Opis awarii *</label>
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Opisz szczegółowo zaobserwowaną awarię..."
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={15} />}
                Wyślij zgłoszenie awarii
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
