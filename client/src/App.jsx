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
          <Route path="/profil/formateur/:id" element={
            <ProtectedRoute roles={['formateur']}>
              <ProfilFormateur />
            </ProtectedRoute>
          } />

          {/* Routes institution */}
          <Route path="/dashboard/institution" element={
            <ProtectedRoute roles={['institution']}>
              <DashboardInstitution />
            </ProtectedRoute>
          } />
          <Route path="/profil/institution/:id" element={
            <ProtectedRoute roles={['institution']}>
              <ProfilInstitution />
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