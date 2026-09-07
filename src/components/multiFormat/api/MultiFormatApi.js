// Unico punto de contacto con el backend para Formato Multiple.
// Hoy responde con mocks; cuando el back este listo se cambia VITE_USE_MOCKS
// a false en el .env y no se modifica nada mas.

import { get, post, put, del } from '../../../services/backend-requests';
import {
    getAllMock,
    getByIdMock,
    createMock,
    updateMock,
    removeMock,
    approveMock,
    rejectMock,
    getApproverMock,
    getCatalogsMock,
    getCurrentEmployeeMock,
} from '../mocks/multiFormat.mock';

const RESOURCE_ROOT = 'MultiFormat';

// .env -> VITE_USE_MOCKS=true (demo) | false (backend real)
export const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

export async function getAll(params) {
    if (USE_MOCKS) return getAllMock(params);
    return await get(`${RESOURCE_ROOT}/listRecords`);
}

export async function getById(id) {
    if (USE_MOCKS) return getByIdMock(id);
    return await get(`${RESOURCE_ROOT}/${id}`);
}

// Enviar el formato al aprobador (lo crea en estado SUBMITTED)
export async function create(payload) {
    if (USE_MOCKS) return createMock(payload);
    return await post(`${RESOURCE_ROOT}`, payload);
}

export async function update(id, payload) {
    if (USE_MOCKS) return updateMock(id, payload);
    return await put(`${RESOURCE_ROOT}/${id}`, payload);
}

export async function remove(id) {
    if (USE_MOCKS) return removeMock(id);
    return await del(`${RESOURCE_ROOT}/${id}`);
}

// --- Acciones del aprobador -------------------------------------------------
// Cuando existan roles, el backend validara que quien llama tenga permiso.

export async function approve(id, comment) {
    if (USE_MOCKS) return approveMock(id, comment);
    return await post(`${RESOURCE_ROOT}/${id}/approve`, { comment: comment ?? null });
}

export async function reject(id, comment) {
    if (USE_MOCKS) return rejectMock(id, comment);
    return await post(`${RESOURCE_ROOT}/${id}/reject`, { comment });
}

export async function getApprover(params) {
    if (USE_MOCKS) return getApproverMock(params);
    return await get(`${RESOURCE_ROOT}/approver`);
}

export async function getCatalogs() {
    if (USE_MOCKS) return getCatalogsMock();
    return await get(`${RESOURCE_ROOT}/catalogs`);
}

export async function getCurrentEmployee() {
    if (USE_MOCKS) return getCurrentEmployeeMock();
    return await get(`${RESOURCE_ROOT}/currentEmployee`);
}
