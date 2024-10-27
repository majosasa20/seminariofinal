// main/authContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Recupera el estado de autenticación de localStorage
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    useEffect(() => {
        // Verifica si hay datos almacenados en localStorage
        const storedUser = localStorage.getItem('userInfo');
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        
        if (storedUser) {
            try {
                setUserInfo(JSON.parse(storedUser));
                setIsAuthenticated(authStatus);
            } catch (error) {
                console.error("Error parsing userInfo:", error);
                localStorage.removeItem('userInfo'); // Limpia userInfo si hay error de parseo
            }
        }
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Guarda el estado en localStorage
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated'); // Elimina el estado de localStorage
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userInfo, setUserInfo,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
