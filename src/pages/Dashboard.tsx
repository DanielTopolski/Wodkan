import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Gauge, CreditCard, Bell, TriangleAlert as AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

interface Stats {
  unreadMessages: number;
  unsettledInvoices: number;
  lastReading: string | null;
  balance: number;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ unreadMessages: 0, unsettledInvoices: 0, lastReading: null, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const [{ count: msgs }, { count: inv }, { data: inv2 }] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'unpaid'),
        supabase.from('invoices').select('total_amount, status').eq('user_id', user.id),
      ]);

      const balance = (inv2 || []).reduce((acc, inv) => {
        return acc + (inv.status === 'unpaid' ? Number(inv.total_amount) : 0);
      }, 0);

      setStats({
        unreadMessages: msgs || 0,
        unsettledInvoices: inv || 0,
        lastReading: null,
        balance,
      });
      setLoading(false);
    }
    load();
  }, [user]);

  const name = profile ? (profile.first_name || profile.email || 'Kliencie') : 'Kliencie';

  return (
    <div>
      <div className="page-header">
        <h1>Witaj, {name}!</h1>
        <p>Elektroniczne Biuro Obsługi Klienta — Tarnobrzeskie Wodociągi Sp. z o.o.</p>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ height: 'auto', padding: '40px' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#eff6ff' }}>
                <Bell size={20} color="var(--primary-600)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.unreadMessages}</div>
                <div className="stat-label">Nowe komunikaty</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef2f2' }}>
                <CreditCard size={20} color="var(--error-600)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.unsettledInvoices}</div>
                <div className="stat-label">Faktury do zapłaty</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fffbeb' }}>
                <TrendingUp size={20} color="var(--warning-600)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.balance.toFixed(2)} zł</div>
                <div className="stat-label">Saldo do zapłaty</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f0fdf4' }}>
                <Gauge size={20} color="var(--success-700)" />
              </div>
              <div className="stat-content">
                <div className="stat-value">—</div>
                <div className="stat-label">Ostatni odczyt</div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3>Szybkie akcje</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/nowy-odczyt" className="quick-link">
                  <Gauge size={16} />
                  <span>Podaj nowy odczyt licznika</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
                <Link to="/faktury-nierozliczone" className="quick-link">
                  <CreditCard size={16} />
                  <span>Sprawdź faktury do zapłaty</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
                <Link to="/awaria" className="quick-link quick-link-danger">
                  <AlertTriangle size={16} />
                  <span>Zgłoś awarię</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
                <Link to="/komunikaty" className="quick-link">
                  <Bell size={16} />
                  <span>Przeczytaj komunikaty</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Informacje kontaktowe</h3>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Firma</span>
                  <span className="info-value">Tarnobrzeskie Wodociągi Sp. z o.o.</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Adres</span>
                  <span className="info-value">ul. Wiślna 1, 39-400 Tarnobrzeg</span>
                </div>
                <div className="info-row">
                  <span className="info-label">E-mail</span>
                  <span className="info-value">bok@wodociagitarnobrzeg.pl</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Telefon</span>
                  <span className="info-value">15 823 22 95</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Godziny pracy</span>
                  <span className="info-value">Pn–Pt: 7:00–15:00</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .quick-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          color: var(--neutral-700);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
          border: 1px solid var(--neutral-100);
          background: var(--neutral-50);
        }
        .quick-link:hover {
          background: var(--primary-50);
          border-color: var(--primary-200);
          color: var(--primary-700);
        }
        .quick-link-danger:hover {
          background: var(--error-50);
          border-color: #fecaca;
          color: var(--error-600);
        }
      `}</style>
    </div>
  );
}
