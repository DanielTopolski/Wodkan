import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hop as Home, User, Gauge, CreditCard, FileText, Bell, Phone, TriangleAlert as AlertTriangle, LogOut, ChevronDown, Menu, X, Droplets } from 'lucide-react';
import './Layout.css';

interface NavItem {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  children?: { label: string; to: string }[];
}

const navItems: NavItem[] = [
  { label: 'Strona główna', to: '/', icon: <Home size={16} /> },
  {
    label: 'Konto',
    icon: <User size={16} />,
    children: [
      { label: 'Dane klienta', to: '/dane-klienta' },
      { label: 'Punkty usług', to: '/punkty-uslug' },
      { label: 'Zmiana danych', to: '/zmiana-danych' },
      { label: 'Zmiana hasła', to: '/zmiana-hasla' },
      { label: 'Aktywności', to: '/aktywnosci' },
    ],
  },
  {
    label: 'Odczyty',
    icon: <Gauge size={16} />,
    children: [
      { label: 'Nowy odczyt', to: '/nowy-odczyt' },
      { label: 'Historia odczytów', to: '/historia-odczytow' },
    ],
  },
  {
    label: 'Płatności',
    icon: <CreditCard size={16} />,
    children: [
      { label: 'Saldo', to: '/saldo' },
      { label: 'Faktury nierozliczone', to: '/faktury-nierozliczone' },
      { label: 'Wpłaty', to: '/wplaty' },
      { label: 'Wszystkie faktury', to: '/wszystkie-faktury' },
    ],
  },
  {
    label: 'e-Dokumenty',
    icon: <FileText size={16} />,
    children: [
      { label: 'Do pobrania', to: '/dokumenty' },
      { label: 'Umowy', to: '/umowy' },
    ],
  },
  { label: 'Komunikaty', to: '/komunikaty', icon: <Bell size={16} /> },
  { label: 'Kontakt', to: '/kontakt', icon: <Phone size={16} /> },
  { label: 'Zgłoś awarię', to: '/awaria', icon: <AlertTriangle size={16} /> },
];

export default function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleMenu(label: string) {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email || 'Klient'
    : 'Klient';

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Droplets size={22} color="white" />
          </div>
          <div>
            <div className="logo-title">EBOK</div>
            <div className="logo-subtitle">Biuro Obsługi Klienta</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div key={item.label}>
              {item.to && !item.children ? (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ) : (
                <>
                  <button
                    className={`nav-item nav-group-trigger ${openMenus[item.label] ? 'open' : ''}`}
                    onClick={() => toggleMenu(item.label)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                    <ChevronDown size={14} className="nav-chevron" />
                  </button>
                  {openMenus[item.label] && (
                    <div className="nav-children">
                      {item.children?.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) => `nav-child ${isActive ? 'nav-child-active' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{fullName.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{fullName}</div>
              {profile?.account_number && (
                <div className="user-account">Nr: {profile.account_number}</div>
              )}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm logout-btn" onClick={handleSignOut}>
            <LogOut size={14} />
            Wyloguj
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main-area">
        <header className="top-bar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="top-bar-company">
            Tarnobrzeskie Wodociągi Sp. z o.o.
          </div>
          <div className="top-bar-right">
            <span className="user-badge">{fullName}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
