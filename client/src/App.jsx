import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RechercheFormateurs from './pages/recherche/RechercheFormateurs';
import RechercheOffres from './pages/recherche/RechercheOffres';
import OffreDetail from './pages/offres/OffreDetail';
import FormationDetail from './pages/formations/FormationDetail';

// Pages formateur
import DashboardFormateur from './pages/formateur/Dashboard';
import ProfilFormateur from './pages/formateur/Profil';

// Pages institution
import DashboardInstitution from './pages/institution/Dashboard';
import ProfilInstitution from './pages/institution/Profil';

// Pages admin
import DashboardAdmin from './pages/admin/Dashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Candidatures from './pages/formateur/Candidatures';
import Formations from './pages/formateur/Forlations';
import OffresDisponibles from './pages/formateur/OffresDisponibles';
import Messages from './pages/formateur/Messages';
import Offres from './pages/institution/Offres';
import CandidaturesInstitution from './pages/institution/Candidatures';
import MessagesInstitution from './pages/institution/Messages';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'formateur') return <Navigate to="/dashboard/formateur" />;
  if (user.role === 'institution') return <Navigate to="/dashboard/institution" />;
  if (user.role === 'admin') return <Navigate to="/dashboard/admin" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recherche/formateurs" element={<RechercheFormateurs />} />
          <Route path="/recherche/offres" element={<RechercheOffres />} />
          <Route path="/offres/:id" element={<OffreDetail />} />
          <Route path="/formations/:id" element={<FormationDetail />} />

          {/* Redirection selon le rôle */}
          <Route path="/redirect" element={<RoleRedirect />} />

          {/* Routes formateur */}
          <Route path="/dashboard/formateur" element={
            <ProtectedRoute roles={['formateur']}>
              <DashboardFormateur />
            </ProtectedRoute>
          } />
          <Route path="/profil/formateur" element={
            <ProtectedRoute roles={['formateur']}>
              <ProfilFormateur />
            </ProtectedRoute>
          } />
          <Route path="/formateur/candidatures" element={
            <ProtectedRoute roles={['formateur']}>
              <Candidatures />
            </ProtectedRoute>
          } />

          <Route path="/formateur/formations" element={
            <ProtectedRoute roles={['formateur']}>
              <Formations />
            </ProtectedRoute>
          } />

          <Route path="/formateur/messages" element={
            <ProtectedRoute roles={['formateur']}>
              <Messages />
            </ProtectedRoute>
          } />

          <Route path="/recherche/offres" element={
            <ProtectedRoute roles={['formateur']}>
              <OffresDisponibles />
            </ProtectedRoute>
          } />

          {/* Routes institution */}
          <Route path="/dashboard/institution" element={
            <ProtectedRoute roles={['institution']}>
              <DashboardInstitution />
            </ProtectedRoute>
          } />
          <Route path="/profil/institution" element={
            <ProtectedRoute roles={['institution']}>
              <ProfilInstitution />
            </ProtectedRoute>
          } />

          <Route path="/institution/offres" element={
            <ProtectedRoute roles={['institution']}>
              <Offres />
            </ProtectedRoute>
          } />
          <Route path="/institution/candidatures" element={
            <ProtectedRoute roles={['institution']}>
              <CandidaturesInstitution />
            </ProtectedRoute>
          } />
          <Route path="/institution/messages" element={
            <ProtectedRoute roles={['institution']}>
              <MessagesInstitution />
            </ProtectedRoute>
          } />

          <Route path="/recherche/formateurs" element={
            <ProtectedRoute roles={['institution']}>
              <RechercheFormateurs />
            </ProtectedRoute>
          } />
          {/* Routes admin */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardAdmin />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;