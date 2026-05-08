/**
 * Context d'authentification
 * Gère l'utilisateur connecté dans toute l'application
 */

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user,setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true);

    // Vérifier si un token existeau chargement de l'app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            authAPI.me()
                .then(data => setUser(data.user))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false)
        }
    },[]);

    /**
     * Connexion -> stocke le token et l'utlisateur 
     */
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData)
    };

    /**
     * Déconnexion -> Supprime le token et l'utilisateur 
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


/**
 * Hook pouutiliser le contexte d'auth
 * Usage : const{ user,login, logout } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);