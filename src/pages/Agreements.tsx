import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Agreement } from '../types';
import { FileCheck } from 'lucide-react';

const typeLabels: Record<string, string> = {
  water_supply: 'Dostawa wody',
  sewage: 'Odprowadzanie ścieków',
  combined: 'Woda + ścieki',
};

const statusLabels: Record<string, { label: string; cls: string }> = {
  active: { label: 'Aktywna', cls: 'badge-success' },
  expired: { label: 'Wygasła', cls: 'badge-neutral' },
  terminated: { label: 'Rozwiązana', cls: 'badge-error' },
};

export default function Agreements() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('agreements')
        .select('*')
        .eq('user_id', user.id)
        .order('signed_date', { ascending: false });
      setAgreements(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Umowy</h1>
        <p>Zawarte umowy o dostarczanie usług</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : agreements.length === 0 ? (
          <div className="card-body"><div className="empty-state"><FileCheck size={40} /><p>Brak umów do wyświetlenia</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Numer umowy</th>
                  <th>Rodzaj umowy</th>
                  <th>Data zawarcia</th>
                  <th>Obowiązuje od</th>
                  <th>Obowiązuje do</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agreements.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{a.agreement_number}</td>
                    <td>{typeLabels[a.agreement_type] || a.agreement_type}</td>
                    <td>{a.signed_date ? new Date(a.signed_date).toLocaleDateString('pl-PL') : '—'}</td>
                    <td>{a.valid_from ? new Date(a.valid_from).toLocaleDateString('pl-PL') : '—'}</td>
                    <td>{a.valid_to ? new Date(a.valid_to).toLocaleDateString('pl-PL') : 'Bezterminowo'}</td>
                    <td>
                      <span className={`badge ${statusLabels[a.status]?.cls || 'badge-neutral'}`}>
                        {statusLabels[a.status]?.label || a.status}
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
