import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { History } from 'lucide-react';

interface ReadingRow {
  id: string;
  reading_date: string;
  reading_value: number;
  consumption: number;
  settlement_status: string;
  notes: string;
  meters: {
    meter_number: string;
    status: string;
    service_points: {
      point_code: string;
      point_name: string;
    };
  };
}

const statusLabels: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Oczekuje', cls: 'badge-warning' },
  settled: { label: 'Rozliczony', cls: 'badge-success' },
  rejected: { label: 'Odrzucony', cls: 'badge-error' },
  unsettled: { label: 'Nierozliczony', cls: 'badge-neutral' },
};

export default function ReadingHistory() {
  const { user } = useAuth();
  const [readings, setReadings] = useState<ReadingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      if (!user) return;
      let query = supabase
        .from('meter_readings')
        .select('*, meters(meter_number, status, service_points(point_code, point_name))')
        .order('reading_date', { ascending: false });

      if (filter !== 'all') query = query.eq('settlement_status', filter);

      const { data } = await query;
      setReadings((data as ReadingRow[]) || []);
      setLoading(false);
    }
    load();
  }, [user, filter]);

  return (
    <div>
      <div className="page-header">
        <h1>Historia odczytów</h1>
        <p>Wszystkie przesłane odczyty liczników</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Odczyty</h3>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Wszystkie statusy</option>
            <option value="pending">Oczekuje</option>
            <option value="settled">Rozliczone</option>
            <option value="rejected">Odrzucone</option>
            <option value="unsettled">Nierozliczone</option>
          </select>
        </div>

        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : readings.length === 0 ? (
          <div className="card-body"><div className="empty-state"><History size={40} /><p>Brak odczytów do wyświetlenia</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kod punktu</th>
                  <th>Punkt usług</th>
                  <th>Numer licznika</th>
                  <th>Status licznika</th>
                  <th>Data odczytu</th>
                  <th>Stan (m³)</th>
                  <th>Zużycie (m³)</th>
                  <th>Status rozliczenia</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{r.meters?.service_points?.point_code || '—'}</td>
                    <td>{r.meters?.service_points?.point_name || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{r.meters?.meter_number || '—'}</td>
                    <td>
                      <span className={`badge ${r.meters?.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {r.meters?.status === 'active' ? 'Czynny' : 'Nieczynny'}
                      </span>
                    </td>
                    <td>{new Date(r.reading_date).toLocaleDateString('pl-PL')}</td>
                    <td style={{ fontWeight: 600 }}>{Number(r.reading_value).toFixed(3)}</td>
                    <td>{Number(r.consumption).toFixed(3)}</td>
                    <td>
                      <span className={`badge ${statusLabels[r.settlement_status]?.cls || 'badge-neutral'}`}>
                        {statusLabels[r.settlement_status]?.label || r.settlement_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
