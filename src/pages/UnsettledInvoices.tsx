import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Invoice } from '../types';
import { FileText } from 'lucide-react';

export default function UnsettledInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'unpaid')
        .order('due_date');
      setInvoices(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const total = invoices.reduce((a, i) => a + Number(i.total_amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Faktury nierozliczone</h1>
        <p>Faktury oczekujące na opłatę</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Należności do zapłaty</h3>
          {invoices.length > 0 && (
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--error-600)' }}>
              Łącznie: {total.toFixed(2)} zł
            </span>
          )}
        </div>

        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : invoices.length === 0 ? (
          <div className="card-body"><div className="empty-state"><FileText size={40} /><p>Brak nierozliczonych faktur</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Numer faktury</th>
                  <th>Data wystawienia</th>
                  <th>Termin płatności</th>
                  <th>Okres rozliczeniowy</th>
                  <th>Kwota netto</th>
                  <th>VAT</th>
                  <th>Do zapłaty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const overdue = new Date(inv.due_date) < new Date();
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{inv.invoice_number}</td>
                      <td>{new Date(inv.issue_date).toLocaleDateString('pl-PL')}</td>
                      <td style={{ color: overdue ? 'var(--error-600)' : undefined, fontWeight: overdue ? 600 : undefined }}>
                        {new Date(inv.due_date).toLocaleDateString('pl-PL')}
                      </td>
                      <td>
                        {inv.service_period_from && inv.service_period_to
                          ? `${new Date(inv.service_period_from).toLocaleDateString('pl-PL')} – ${new Date(inv.service_period_to).toLocaleDateString('pl-PL')}`
                          : '—'}
                      </td>
                      <td>{Number(inv.amount).toFixed(2)} zł</td>
                      <td>{Number(inv.vat_amount).toFixed(2)} zł</td>
                      <td style={{ fontWeight: 700 }}>{Number(inv.total_amount).toFixed(2)} zł</td>
                      <td>
                        <span className={`badge ${overdue ? 'badge-error' : 'badge-warning'}`}>
                          {overdue ? 'Po terminie' : 'Do zapłaty'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
