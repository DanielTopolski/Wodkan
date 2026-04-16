import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Payment } from '../types';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });
      setPayments(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const total = payments.reduce((a, p) => a + Number(p.amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Wpłaty</h1>
        <p>Historia dokonanych płatności</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Historia wpłat</h3>
          {payments.length > 0 && (
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success-700)' }}>
              Łącznie: {total.toFixed(2)} zł
            </span>
          )}
        </div>

        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : payments.length === 0 ? (
          <div className="card-body"><div className="empty-state"><CreditCard size={40} /><p>Brak zarejestrowanych wpłat</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data wpłaty</th>
                  <th>Kwota</th>
                  <th>Opis</th>
                  <th>Numer referencyjny</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{new Date(p.payment_date).toLocaleDateString('pl-PL')}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success-700)' }}>+ {Number(p.amount).toFixed(2)} zł</td>
                    <td>{p.description || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.reference_number || '—'}</td>
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
