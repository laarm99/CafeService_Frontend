// Unico punto de contacto con el backend para Configuracion (Admin).
// Endpoints: /api/configuration/supervisors y /api/configuration/users.
// domainUserName es el NetKey.

import { get, put, patch } from '../../../services/backend-requests';

const SUPERVISORS = 'configuration/supervisors';
const USERS = 'configuration/users';

// Todas las respuestas llegan en el envelope { isSuccess, statusCode, data }.
function unwrap(response, expected) {
    const result = response.data;

    if (result?.isSuccess !== true || (expected === 'array' && !Array.isArray(result.data))) {
        const error = new Error(result?.message || 'La respuesta no tiene el formato esperado.');
        error.response = { status: result?.statusCode, data: result };
        throw error;
    }

    return result.data;
}

export async function getSupervisors() {
    return unwrap(await get(SUPERVISORS), 'array');
}

export async function updateSupervisor(id, { domainUserName, email }) {
    return unwrap(await put(`${SUPERVISORS}/${encodeURIComponent(id)}`, { domainUserName, email }));
}

export async function setSupervisorStatus(id, isActive) {
    return unwrap(await patch(`${SUPERVISORS}/${encodeURIComponent(id)}/status`, { isActive }));
}

export async function getUsers() {
    return unwrap(await get(USERS), 'array');
}

export async function updateUserRole(id, roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return unwrap(await put(`${USERS}/${encodeURIComponent(id)}/roles`, { roles: rolesArray }));
}

export async function setUserStatus(id, isActive) {
    return unwrap(await patch(`${USERS}/${encodeURIComponent(id)}/status`, { isActive }));
}
