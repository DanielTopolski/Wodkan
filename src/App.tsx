import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerData from './pages/CustomerData';
import ServicePoints from './pages/ServicePoints';
import ChangeData from './pages/ChangeData';
import ChangePassword from './pages/ChangePassword';
import Activities from './pages/Activities';
import NewReading from './pages/NewReading';
import ReadingHistory from './pages/ReadingHistory';
import Balance from './pages/Balance';
import UnsettledInvoices from './pages/UnsettledInvoices';
import AllInvoices from './pages/AllInvoices';
import PaymentsPage from './pages/PaymentsPage';
import Documents from './pages/Documents';
import Agreements from './pages/Agreements';
import Messages from './pages/Messages';
import Contact from './pages/Contact';
import DefectReport from './pages/DefectReport';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Proszę czekać...</p>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Proszę czekać...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dane-klienta" element={<CustomerData />} />
        <Route path="punkty-uslug" element={<ServicePoints />} />
        <Route path="zmiana-danych" element={<ChangeData />} />
        <Route path="zmiana-hasla" element={<ChangePassword />} />
        <Route path="aktywnosci" element={<Activities />} />
        <Route path="nowy-odczyt" element={<NewReading />} />
        <Route path="historia-odczytow" element={<ReadingHistory />} />
        <Route path="saldo" element={<Balance />} />
        <Route path="faktury-nierozliczone" element={<UnsettledInvoices />} />
        <Route path="wszystkie-faktury" element={<AllInvoices />} />
        <Route path="wplaty" element={<PaymentsPage />} />
        <Route path="dokumenty" element={<Documents />} />
        <Route path="umowy" element={<Agreements />} />
        <Route path="komunikaty" element={<Messages />} />
        <Route path="kontakt" element={<Contact />} />
        <Route path="awaria" element={<DefectReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
