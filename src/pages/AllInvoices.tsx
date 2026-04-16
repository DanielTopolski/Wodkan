import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Invoice } from '../types';
import { FileText } from 'lucide-react';

const statusLabels: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Opłacona', cls: 'badge-success' },
  unpaid: { label: 'Nieopłacona', cls: 'badge-warning' },
  overdue: { label: 'Przeterminowana', cls: 'badge-error' },
};

export default function AllInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      if (!user) return;
      let query = supabase.from('invoices').select('*').eq('user_id', user.id).order('issue_date', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter);
      const { data } = await query;
      setInvoices(data || []);
      setLoading(false);
    }
    load();
  }, [user, filter]);

  return (
    <div>
      <div className="page-header">
        <h1>Wszystkie faktury</h1>
        <p>Pełna historia faktur i rozliczeń</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Faktury ({invoices.length})</h3>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Wszystkie</option>
            <option value="unpaid">Nieopłacone</option>
            <option value="paid">Opłacone</option>
          </select>
        </div>

        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : invoices.length === 0 ? (
          <div className="card-body"><div className="empty-state"><FileText size={40} /><p>Brak faktur do wyświetlenia</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Numer faktury</th>
                  <th>Data wystawienia</th>
                  <th>Termin płatności</th>
                  <th>Okres</th>
                  <th>Kwota brutto</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{inv.invoice_number}</td>
                    <td>{new Date(inv.issue_date).toLocaleDateString('pl-PL')}</td>
                    <td>{new Date(inv.due_date).toLocaleDateString('pl-PL')}</td>
                    <td>
                      {inv.service_period_from && inv.service_period_to
                        ? `${new Date(inv.service_period_from).toLocaleDateString('pl-PL')} – ${new Date(inv.service_period_to).toLocaleDateString('pl-PL')}`
                        : '—'}
                    </td>
                    <td style={{ fontWeight: 700 }}>{Number(inv.total_amount).toFixed(2)} zł</td>
                    <td>
                      <span className={`badge ${statusLabels[inv.status]?.cls || 'badge-neutral'}`}>
                        {statusLabels[inv.status]?.label || inv.status}
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
