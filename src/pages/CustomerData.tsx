import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerData() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div>
        <div className="page-header"><h1>Dane klienta</h1></div>
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <User size={40} />
              <p>Brak danych klienta. <Link to="/zmiana-danych">Uzupełnij swój profil</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dane klienta</h1>
        <p>Informacje o Twoim koncie</p>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <h3>Dane osobowe</h3>
            <Link to="/zmiana-danych" className="btn btn-secondary btn-sm">Edytuj</Link>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Imię i nazwisko</span>
              <span className="info-value">{profile.first_name} {profile.last_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Adres e-mail</span>
              <span className="info-value">{profile.email || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Telefon</span>
              <span className="info-value">{profile.phone || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Numer konta</span>
              <span className="info-value">{profile.account_number || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status konta</span>
              <span className="info-value">
                <span className={`badge ${profile.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                  {profile.status === 'active' ? 'Aktywne' : 'Nieaktywne'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Adres korespondencyjny</h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Ulica</span>
              <span className="info-value">{profile.address_street || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Miasto</span>
              <span className="info-value">{profile.address_city || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Kod pocztowy</span>
              <span className="info-value">{profile.address_postal_code || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
