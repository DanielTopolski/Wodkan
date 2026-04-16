import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Download, FileText } from 'lucide-react';

interface Doc {
  id: string;
  title: string;
  document_type: string;
  file_name: string;
  file_url: string;
  issue_date: string | null;
  created_at: string;
}

export default function Documents() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_contract', false)
        .order('created_at', { ascending: false });
      setDocs(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Dokumenty do pobrania</h1>
        <p>Dostępne dokumenty i pliki</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="card-body"><div className="loading-screen" style={{ height: 'auto', padding: '40px' }}><div className="spinner" /></div></div>
        ) : docs.length === 0 ? (
          <div className="card-body"><div className="empty-state"><Download size={40} /><p>Brak dostępnych dokumentów</p></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nazwa dokumentu</th>
                  <th>Typ</th>
                  <th>Data wystawienia</th>
                  <th>Pobierz</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={16} color="var(--neutral-400)" />
                        {doc.title || doc.file_name}
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{doc.document_type}</span></td>
                    <td>{doc.issue_date ? new Date(doc.issue_date).toLocaleDateString('pl-PL') : '—'}</td>
                    <td>
                      {doc.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                          <Download size={14} /> Pobierz
                        </a>
                      ) : '—'}
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
