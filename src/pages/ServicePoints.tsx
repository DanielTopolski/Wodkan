import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { ServicePoint, Meter } from '../types';
import { MapPin, Gauge } from 'lucide-react';

interface ServicePointWithMeters extends ServicePoint {
  meters: Meter[];
}

export default function ServicePoints() {
  const { user } = useAuth();
  const [points, setPoints] = useState<ServicePointWithMeters[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('service_points')
        .select('*, meters(*)')
        .eq('user_id', user.id)
        .order('created_at');
      setPoints((data as ServicePointWithMeters[]) || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Punkty usług</h1>
        <p>Adresy i liczniki przypisane do Twojego konta</p>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div>
      ) : points.length === 0 ? (
        <div className="card"><div className="card-body"><div className="empty-state"><MapPin size={40} /><p>Brak przypisanych punktów usług</p></div></div></div>
      ) : (
        <div className="section-gap">
          {points.map(point => (
            <div key={point.id} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary-50)' }}>
                    <MapPin size={16} color="var(--primary-600)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-800)' }}>{point.point_name || point.point_code}</div>
                    <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Kod punktu: {point.point_code}</div>
                  </div>
                </div>
                <span className={`badge ${point.is_active ? 'badge-success' : 'badge-neutral'}`}>
                  {point.is_active ? 'Aktywny' : 'Nieaktywny'}
                </span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Adres</span>
                  <span className="info-value">{[point.address_street, point.address_city].filter(Boolean).join(', ') || '—'}</span>
                </div>

                {point.meters.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                      Liczniki
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {point.meters.map(meter => (
                        <div key={meter.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-100)' }}>
                          <Gauge size={16} color="var(--neutral-400)" />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{meter.meter_number}</div>
                            <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Zainstalowany: {meter.installation_date || '—'}</div>
                          </div>
                          <span className={`badge ${meter.status === 'active' ? 'badge-success' : 'badge-neutral'}`} style={{ marginLeft: 'auto' }}>
                            {meter.status === 'active' ? 'Czynny' : 'Nieczynny'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
