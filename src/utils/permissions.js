// FUENTE UNICA de las reglas de acceso por rol.
// Los valores de rol son los que devuelve el backend (auth/login y /configuration/users).
// Esto solo controla lo que la interfaz muestra: el backend valida siempre cada operacion.
// Soporta roles como string (compatibilidad actual) o array (múltiples roles futuros).

export const ROLES = {
    ADMIN: "Admin",
    SUPERVISOR: "Supervisor",
    GENERAL: "GeneralUser",
};

const NO_PERMISSIONS = {
    canViewForms: false,
    canCreateForms: false,
    canViewConfiguration: false,
    canManageSupervisors: false,
    canManageUsers: false,
    canCreateVacation: false,
    canCreatePermission: false,
    canCreateTimeAdjustment: false,
    canViewDepartmentShiftChange: false,
    canApproveRequests: false,
    canCompleteRequests: false,
    canDownloadPdf: false,
    hasMultipleRoles: false,
    requiresApprovalForOwnRequest: false,
};

// Normalizar roles a array. Compatibilidad: role (string) o roles (array).
function normalizeRoles(user) {
    if (!user) return [];

    // Backend actual: user.role = "Admin"
    if (user.role && typeof user.role === "string") {
        return [user.role];
    }

    // Backend futuro: user.roles = ["Admin", "Supervisor"]
    if (Array.isArray(user.roles)) {
        return user.roles;
    }

    return [];
}

export function getPermissions(user) {
    const roles = normalizeRoles(user);
    const hasMultipleRoles = roles.length > 1;

    const isAdmin = roles.includes(ROLES.ADMIN);
    const isSupervisor = roles.includes(ROLES.SUPERVISOR);
    const isGeneral = roles.includes(ROLES.GENERAL);

    if (!isAdmin && !isSupervisor && !isGeneral) return NO_PERMISSIONS;

    // Si tiene Admin + Supervisor: puede aprobar formatos de su equipo
    // pero sus propios formatos requieren validación (no puede auto-aprobarse)
    const requiresApprovalForOwnRequest = isAdmin && isSupervisor;

    return {
        canViewForms: true,
        canCreateForms: isGeneral,
        canViewConfiguration: isAdmin,
        canManageSupervisors: isAdmin,
        canManageUsers: isAdmin,
        canCreateVacation: isGeneral,
        canCreatePermission: isGeneral,
        canCreateTimeAdjustment: isGeneral,
        // Cambio de depto/turno deshabilitado temporalmente (el cliente lo esta evaluando).
        canViewDepartmentShiftChange: false,
        canApproveRequests: isSupervisor,
        canCompleteRequests: isAdmin,
        canDownloadPdf: isAdmin,
        hasMultipleRoles,
        requiresApprovalForOwnRequest,
    };
}
