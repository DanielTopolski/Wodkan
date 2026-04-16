import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, Eye, EyeOff } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError('Nieprawidłowy adres e-mail lub hasło.');
    } else {
      const { error } = await signUp(email, password);
      if (error) setError('Rejestracja nieudana. Spróbuj ponownie.');
      else setSuccess('Konto zostało utworzone. Możesz się teraz zalogować.');
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <Droplets size={32} color="white" />
          </div>
          <h1>EBOK</h1>
          <p>Elektroniczne Biuro Obsługi Klienta</p>
          <div className="login-brand-info">
            <p>Tarnobrzeskie Wodociągi Sp. z o.o.</p>
            <p>39-400 Tarnobrzeg, ul. Wiślna 1</p>
            <p>bok@wodociagitarnobrzeg.pl</p>
            <p>tel. 15 823 22 95</p>
          </div>
        </div>
      </div>

      <div className="login-form-area">
        <div className="login-card">
          <div className="login-card-header">
            <h2>{mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}</h2>
            <p>{mode === 'login' ? 'Wprowadź swoje dane dostępowe' : 'Utwórz nowe konto klienta'}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Adres e-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="np. jan.kowalski@email.pl"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hasło</label>
              <div className="pwd-wrapper">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Wprowadź hasło"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : null}
              {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'login' ? (
              <p>Nie masz konta? <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}>Zarejestruj się</button></p>
            ) : (
              <p>Masz już konto? <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Zaloguj się</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
