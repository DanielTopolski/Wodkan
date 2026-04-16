import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (password !== confirm) {
      setError('Hasła nie są identyczne.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError('Nie udało się zmienić hasła. Spróbuj ponownie.');
    else {
      setSuccess('Hasło zostało zmienione pomyślnie.');
      setPassword('');
      setConfirm('');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Zmiana hasła</h1>
        <p>Ustaw nowe hasło do swojego konta</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-header"><h3>Nowe hasło</h3></div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nowe hasło</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 znaków"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', display: 'flex' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Potwierdź nowe hasło</label>
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Powtórz nowe hasło"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Lock size={15} />}
              Zmień hasło
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
