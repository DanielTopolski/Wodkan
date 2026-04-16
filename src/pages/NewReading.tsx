import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { ServicePoint, Meter } from '../types';
import { Gauge, Send } from 'lucide-react';

interface ServicePointWithMeters extends ServicePoint {
  meters: Meter[];
}

export default function NewReading() {
  const { user } = useAuth();
  const [points, setPoints] = useState<ServicePointWithMeters[]>([]);
  const [selectedPoint, setSelectedPoint] = useState('');
  const [selectedMeter, setSelectedMeter] = useState('');
  const [indication, setIndication] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('service_points')
        .select('*, meters(*)')
        .eq('user_id', user.id)
        .eq('is_active', true);
      setPoints((data as ServicePointWithMeters[]) || []);
      setLoadingData(false);
    }
    load();
  }, [user]);

  const availableMeters = points.find(p => p.id === selectedPoint)?.meters || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedMeter) { setError('Wybierz licznik.'); return; }
    if (!indication || isNaN(Number(indication))) { setError('Podaj prawidłowy stan licznika.'); return; }
    if (new Date(date) > new Date()) { setError('Data odczytu nie może być z przyszłości.'); return; }

    setLoading(true);

    const { data: lastReadings } = await supabase
      .from('meter_readings')
      .select('reading_value')
      .eq('meter_id', selectedMeter)
      .order('reading_date', { ascending: false })
      .limit(1);

    const lastValue = lastReadings?.[0]?.reading_value ?? 0;
    const consumption = Math.max(0, Number(indication) - Number(lastValue));

    const { error } = await supabase.from('meter_readings').insert({
      meter_id: selectedMeter,
      reading_date: date,
      reading_value: Number(indication),
      consumption,
      settlement_status: 'pending',
      notes,
    });

    if (error) setError('Wystąpił błąd podczas zapisywania odczytu.');
    else {
      setSuccess('Odczyt został pomyślnie zapisany.');
      setIndication('');
      setNotes('');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Nowy odczyt</h1>
        <p>Podaj aktualny stan licznika</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Gauge size={18} color="var(--primary-600)" />
            <h3>Formularz odczytu</h3>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loadingData ? (
            <div className="loading-screen" style={{ height: 'auto', padding: '30px' }}><div className="spinner" /></div>
          ) : points.length === 0 ? (
            <div className="alert alert-warning">Brak aktywnych punktów usług przypisanych do Twojego konta.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Punkt usług</label>
                <select className="form-select" value={selectedPoint} onChange={e => { setSelectedPoint(e.target.value); setSelectedMeter(''); }} required>
                  <option value="">— Wybierz punkt usług —</option>
                  {points.map(p => (
                    <option key={p.id} value={p.id}>{p.point_name || p.point_code}</option>
                  ))}
                </select>
              </div>

              {selectedPoint && (
                <div className="form-group">
                  <label className="form-label">Numer licznika</label>
                  <select className="form-select" value={selectedMeter} onChange={e => setSelectedMeter(e.target.value)} required>
                    <option value="">— Wybierz licznik —</option>
                    {availableMeters.map(m => (
                      <option key={m.id} value={m.id}>{m.meter_number}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Data odczytu</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stan licznika (m³)</label>
                <input
                  type="number"
                  className="form-input"
                  value={indication}
                  onChange={e => setIndication(e.target.value)}
                  placeholder="np. 1234.567"
                  step="0.001"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Uwagi (opcjonalnie)</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dodatkowe informacje..." rows={3} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={15} />}
                Wyślij odczyt
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
