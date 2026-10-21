import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "./api/LoginApi";

export const AuthContext = createContext();

const EMPTY_AUTH = {
    isAuthenticated: false,
    user: null,
};

export default function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [auth, setAuth] = useState(EMPTY_AUTH);
    const [loading, setLoading] = useState(true);

    // Evitar que una respuesta pendiente restaure la sesión
    // después de que el usuario haya cerrado sesión.
    const sessionVersion = useRef(0);

    // Mantener la firma que ya utiliza LoginPage.jsx:
    // loginCtx(response.data).
    const loginCtx = useCallback((user) => {
        if (
            !user ||
            typeof user !== "object" ||
            typeof user.domainUserName !== "string" ||
            !user.domainUserName.trim() ||
            user.isActive !== true
        ) {
            throw new Error(
                "El backend no devolvió una cuenta válida."
            );
        }

        // Validar que tenga roles (array) o role (string) para compatibilidad
        const hasRoles = Array.isArray(user.roles) && user.roles.length > 0;
        const hasRole = typeof user.role === "string" && user.role.trim();

        if (!hasRoles && !hasRole) {
            throw new Error(
                "El usuario no tiene roles asignados."
            );
        }

        sessionVersion.current += 1;

        // Se guarda como referencia para solicitar la
        // validación al recargar, no como prueba de acceso.
        localStorage.setItem("user", JSON.stringify(user));

        setAuth({
            isAuthenticated: true,
            user,
        });

        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        sessionVersion.current += 1;

        localStorage.removeItem("user");

        setAuth(EMPTY_AUTH);
        setLoading(false);

        navigate("/login", { replace: true });
    }, [navigate]);

    useEffect(() => {
        let cancelled = false;

        const version = sessionVersion.current;

        const isCurrentRequest = () =>
            !cancelled &&
            sessionVersion.current === version;

        async function restoreSession() {
            try {
                const storedUser = localStorage.getItem("user");

                // Sin una sesión previa, se conserva la pantalla
                // de login. No iniciar sesión automáticamente.
                if (!storedUser) {
                    if (isCurrentRequest()) {
                        setAuth(EMPTY_AUTH);
                    }

                    return;
                }

                // No confiar en los datos guardados:
                // consultar de nuevo al backend.
                const response = await Login();
                const user = response.data;

                if (!isCurrentRequest()) {
                    return;
                }

                if (
                    !user ||
                    typeof user !== "object" ||
                    typeof user.domainUserName !== "string" ||
                    !user.domainUserName.trim() ||
                    user.isActive !== true
                ) {
                    throw new Error(
                        "El backend no devolvió una cuenta válida."
                    );
                }

                // Validar que tenga roles (array) o role (string) para compatibilidad
                const hasRoles = Array.isArray(user.roles) && user.roles.length > 0;
                const hasRole = typeof user.role === "string" && user.role.trim();

                if (!hasRoles && !hasRole) {
                    throw new Error(
                        "El usuario no tiene roles asignados."
                    );
                }

                // Reemplazar la copia local por los datos
                // que acaba de devolver el backend.
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                setAuth({
                    isAuthenticated: true,
                    user,
                });
            } catch {
                // Si no se puede validar el acceso, no restaurarlo.
                // Incluye acceso denegado y problemas de conexión.
                if (isCurrentRequest()) {
                    localStorage.removeItem("user");
                    setAuth(EMPTY_AUTH);
                }
            } finally {
                if (isCurrentRequest()) {
                    setLoading(false);
                }
            }
        }

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                auth,
                loading,
                loginCtx,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}