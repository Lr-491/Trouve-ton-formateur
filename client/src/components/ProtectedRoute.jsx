/**
 * Composant de protection des routes
 * Redirige vers /login si l'utilisateur n'est pas connecté
 * Redirige vers /complete-profil si le profil n'est pas complété
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  // Attendre que le contexte soit chargé
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Chargement...</p>
      </div>
    );
  }

  // Non connecté → login
  if (!user) return <Navigate to="/login" />;

  // Rôle non autorisé
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;