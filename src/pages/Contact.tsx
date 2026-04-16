import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div>
      <div className="page-header">
        <h1>Kontakt</h1>
        <p>Dane kontaktowe Biura Obsługi Klienta</p>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Dane firmy</h3></div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Nazwa</span>
              <span className="info-value">Tarnobrzeskie Wodociągi Sp. z o.o.</span>
            </div>
            <div className="info-row">
              <span className="info-label"><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Adres</span>
              <span className="info-value">ul. Wiślna 1<br />39-400 Tarnobrzeg</span>
            </div>
            <div className="info-row">
              <span className="info-label"><Mail size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />E-mail</span>
              <span className="info-value">bok@wodociagitarnobrzeg.pl</span>
            </div>
            <div className="info-row">
              <span className="info-label"><Phone size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Telefon</span>
              <span className="info-value">15 823 22 95</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Godziny pracy</h3></div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label"><Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Poniedziałek</span>
              <span className="info-value">7:00 – 15:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Wtorek</span>
              <span className="info-value">7:00 – 15:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Środa</span>
              <span className="info-value">7:00 – 15:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Czwartek</span>
              <span className="info-value">7:00 – 15:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Piątek</span>
              <span className="info-value">7:00 – 15:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Sobota – Niedziela</span>
              <span className="info-value" style={{ color: 'var(--neutral-400)' }}>Nieczynne</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header"><h3>Awarie i zgłoszenia nagłe</h3></div>
          <div className="card-body">
            <div className="alert alert-warning" style={{ marginBottom: 0 }}>
              <Phone size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Telefon alarmowy (całą dobę): 15 823 22 95</strong><br />
                W przypadku awarii sieci wodociągowej lub kanalizacyjnej prosimy o natychmiastowy kontakt telefoniczny lub skorzystanie z formularza zgłoszenia awarii.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
