/**
 * Tipos para el usuario autenticado.
 * Soporta tanto role (string, actual) como roles (array, futuro).
 */

/**
 * @typedef {Object} User
 * @property {string} domainUserName - Identificador del usuario en el dominio
 * @property {boolean} isActive - Estado activo/inactivo del usuario
 * @property {string} [role] - DEPRECATED: rol único del usuario (compatibilidad actual)
 * @property {string[]} [roles] - Múltiples roles del usuario (futuro)
 * @property {string} [id] - ID del usuario (opcional, según backend)
 * @property {string} [email] - Email del usuario (opcional, según backend)
 * @property {string} [name] - Nombre del usuario (opcional, según backend)
 * @property {string} [employeeNumber] - Número de empleado (opcional, según backend)
 */

/**
 * @typedef {Object} Permissions
 * @property {boolean} canViewForms
 * @property {boolean} canCreateForms
 * @property {boolean} canViewConfiguration
 * @property {boolean} canManageSupervisors
 * @property {boolean} canManageUsers
 * @property {boolean} canCreateVacation
 * @property {boolean} canCreatePermission
 * @property {boolean} canCreateTimeAdjustment
 * @property {boolean} canViewDepartmentShiftChange
 * @property {boolean} canApproveRequests
 * @property {boolean} hasMultipleRoles - True si el usuario tiene múltiples roles
 * @property {boolean} requiresApprovalForOwnRequest - True si sus propios requests necesitan aprobación (Admin + Supervisor)
 */

/**
 * @typedef {Object} AuthContextType
 * @property {Object} auth
 * @property {boolean} auth.isAuthenticated
 * @property {User|null} auth.user
 * @property {boolean} loading
 * @property {Function} loginCtx - Función para hacer login
 * @property {Function} logout - Función para cerrar sesión
 */
