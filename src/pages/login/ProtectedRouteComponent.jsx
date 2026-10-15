import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { AuthContext } from "./AuthProvider";

export default function ProtectedRouteComponent({ children }) {
    const { auth, loading } = useContext(AuthContext);

    // Esperar a que AuthProvider termine de validar
    // la sesión antes de mostrar la pantalla protegida.
    if (loading) {
        return (
            <div
                role="status"
                aria-busy="true"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    // Si no hay una sesión validada, regresar al login.
    if (!auth.isAuthenticated || !auth.user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}