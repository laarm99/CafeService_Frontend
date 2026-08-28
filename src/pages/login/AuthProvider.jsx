import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
    });
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (user) {
            setAuth({
                isAuthenticated: true,
                user: JSON.parse(user)
            });
        } else {
            console.log("No hay token");
        }
        setLoading(false); // Finaliza la carga
    }, []);

    const loginCtx = (user) => {

        setAuth({
            isAuthenticated: true,
            user
        });

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
    };

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            user: null
        });
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div>Cargando...</div>; // Muestra un spinner o mensaje de carga
    }

    return (
        <AuthContext.Provider value={{ auth, loading, loginCtx, logout }}>
            {children}
        </AuthContext.Provider>
    );
}