import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Message } from '../types';
import { Bell, X } from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setMessages(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  async function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Komunikaty</h1>
        <p>Wiadomości od biura obsługi klienta</p>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ maxWidth: 560, width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="card-header">
              <h3>{selected.subject}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>
            <div className="card-body">
              <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginBottom: 16 }}>
                {new Date(selected.created_at).toLocaleString('pl-PL')}
              </div>
              <p style={{ lineHeight: 1.7, color: 'var(--neutral-700)', whiteSpace: 'pre-wrap' }}>{selected.content}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : messages.length === 0 ? (
          <div className="card-body"><div className="empty-state"><Bell size={40} /><p>Brak komunikatów</p></div></div>
        ) : (
          <div>
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--neutral-100)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  background: !msg.is_read ? 'var(--primary-50)' : 'white',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--neutral-50)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = !msg.is_read ? 'var(--primary-50)' : 'white'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: !msg.is_read ? 'var(--primary-600)' : 'transparent', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: !msg.is_read ? 600 : 400, color: 'var(--neutral-800)', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.subject}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--neutral-400)', flexShrink: 0 }}>
                      {new Date(msg.created_at).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.content.substring(0, 100)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
