import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Result, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./AuthProvider";
import usePermissions from "./usePermissions";

// permission: nombre de una regla de utils/permissions.js (por ejemplo
// "canViewConfiguration"). Sin ese permiso se muestra el 403 aunque
// el usuario escriba la URL manualmente.
export default function ProtectedRouteComponent({ children, permission = null }) {
    const { auth, loading } = useContext(AuthContext);
    const permissions = usePermissions();
    const { t } = useTranslation();

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

    if (permission && !permissions[permission]) {
        return (
            <Result
                status="403"
                title="403"
                subTitle={t("forbidden.message")}
                extra={(
                    <Link to="/homePage">
                        <Button type="primary">{t("forbidden.backHome")}</Button>
                    </Link>
                )}
            />
        );
    }

    return children;
}