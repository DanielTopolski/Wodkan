import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Invoice, Payment } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Balance() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const [{ data: inv }, { data: pay }] = await Promise.all([
        supabase.from('invoices').select('*').eq('user_id', user.id),
        supabase.from('payments').select('*').eq('user_id', user.id),
      ]);
      setInvoices(inv || []);
      setPayments(pay || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const totalCharged = invoices.reduce((a, i) => a + Number(i.total_amount), 0);
  const totalPaid = payments.reduce((a, p) => a + Number(p.amount), 0);
  const balance = totalCharged - totalPaid;

  return (
    <div>
      <div className="page-header">
        <h1>Saldo</h1>
        <p>Przegląd Twojego salda rozrachunkowego</p>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div>
      ) : (
        <div className="section-gap">
          <div className="grid-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--error-50)' }}>
                <TrendingUp size={20} color="var(--error-600)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalCharged.toFixed(2)} zł</div>
                <div className="stat-label">Suma naliczonych należności</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-50)' }}>
                <TrendingDown size={20} color="var(--success-700)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalPaid.toFixed(2)} zł</div>
                <div className="stat-label">Suma wpłat</div>
              </div>
            </div>
            <div className="stat-card" style={{ border: `2px solid ${balance > 0 ? '#fecaca' : '#bbf7d0'}` }}>
              <div className="stat-icon" style={{ background: balance > 0 ? 'var(--error-50)' : 'var(--success-50)' }}>
                <TrendingUp size={20} color={balance > 0 ? 'var(--error-600)' : 'var(--success-700)'} />
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: balance > 0 ? 'var(--error-600)' : 'var(--success-700)' }}>
                  {balance.toFixed(2)} zł
                </div>
                <div className="stat-label">{balance > 0 ? 'Saldo do zapłaty' : 'Nadpłata'}</div>
              </div>
            </div>
          </div>

          {balance > 0 && (
            <div className="alert alert-warning">
              Twoje saldo wynosi <strong>{balance.toFixed(2)} zł</strong>. Prosimy o uregulowanie zaległości.
            </div>
          )}

          {balance <= 0 && invoices.length > 0 && (
            <div className="alert alert-success">
              Wszystkie należności zostały opłacone. Dziękujemy!
            </div>
          )}

          {invoices.length === 0 && (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <p>Brak danych do wyświetlenia</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
