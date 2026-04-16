import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Activity } from '../types';
import { Activity as ActivityIcon } from 'lucide-react';

const typeLabels: Record<string, string> = {
  login: 'Logowanie',
  logout: 'Wylogowanie',
  failed_login: 'Nieudana próba logowania',
  password_change: 'Zmiana hasła',
  data_change: 'Zmiana danych',
  reading_submit: 'Podanie odczytu',
};

export default function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setActivities(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Aktywności</h1>
        <p>Historia operacji wykonanych na Twoim koncie</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : activities.length === 0 ? (
          <div className="card-body"><div className="empty-state"><ActivityIcon size={40} /><p>Brak zarejestrowanych aktywności</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Typ aktywności</th>
                  <th>Opis</th>
                  <th>Adres IP</th>
                  <th>Data i godzina</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(a => (
                  <tr key={a.id}>
                    <td>
                      <span className={`badge ${a.activity_type === 'failed_login' ? 'badge-error' : 'badge-primary'}`}>
                        {typeLabels[a.activity_type] || a.activity_type}
                      </span>
                    </td>
                    <td>{a.description || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.ip_address || '—'}</td>
                    <td>{new Date(a.created_at).toLocaleString('pl-PL')}</td>
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
