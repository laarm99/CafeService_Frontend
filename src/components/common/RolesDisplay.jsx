import { Tag } from "antd";

const ROLE_COLORS = {
    Admin: "red",
    Supervisor: "orange",
    GeneralUser: "blue",
};

/**
 * Componente para mostrar roles múltiples como tags.
 * Soporta roles como string (actual) o array (futuro).
 *
 * Ejemplo:
 * <RolesDisplay roles={["Admin", "Supervisor"]} />
 * <RolesDisplay roles="Admin" />
 */
export default function RolesDisplay({ roles, className = "" }) {
    if (!roles) return null;

    // Normalizar a array
    const rolesArray = Array.isArray(roles)
        ? roles
        : typeof roles === "string"
        ? [roles]
        : [];

    if (rolesArray.length === 0) return null;

    return (
        <div className={className}>
            {rolesArray.map((role) => (
                <Tag
                    key={role}
                    color={ROLE_COLORS[role] || "default"}
                    style={{ marginRight: "4px" }}
                >
                    {role}
                </Tag>
            ))}
        </div>
    );
}
