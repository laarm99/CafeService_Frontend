import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";


export default function ProtectedRouteComponent({children}){
    const { auth, loading } = useContext(AuthContext);
    if (loading) {
        return <div>Cargando...</div>; // Muestra un spinner o mensaje de carga
    }
console.log("AUTH", auth);
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};