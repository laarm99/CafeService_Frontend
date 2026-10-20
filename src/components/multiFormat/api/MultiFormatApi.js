// Unico punto de contacto con el backend para Formato Multiple.
// La creacion de solicitudes usa los endpoints reales; las demas operaciones
// conservan el modo mock controlado por VITE_USE_MOCKS.

import { get, post, put, del } from '../../../services/backend-requests';
import {
    updateMock,
    removeMock,
    approveMock,
    rejectMock,
    getApproverMock,
    getCatalogsMock,
} from '../mocks/multiFormat.mock';
import { toDetailRecord, toPayload } from '../mappers/multiFormat.mapper';

const RESOURCE_ROOT = 'MultiFormat';
const FORM_REQUESTS_ENDPOINT = 'form-requests';
const CREATE_ENDPOINTS = {
    CHANGE_DEP_SHIFT: 'changes-department-or-shift/create-change-request',
    PERMISSION: 'permission-request/create-permission-request',
    TIME_ADJUSTMENT: 'time-adjustment-request/create-time-adjustment-request',
    VACATION: 'vacation-request/create-vacation-request',
};

// .env -> VITE_USE_MOCKS=true (demo) | false (backend real)
export const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

export async function getAll(params = {}) {
    const response = await get(FORM_REQUESTS_ENDPOINT, { params });
    const result = response.data;

    if (result?.isSuccess !== true || !Array.isArray(result.data)) {
        const error = new Error(
            result?.message || 'La respuesta de requerimientos no tiene el formato esperado.'
        );
        error.response = { data: result };
        throw error;
    }

    return { ...response, data: result.data };
}

export async function getById(id) {
    if (id === undefined || id === null || id === '') {
        throw new Error('Se requiere el id del requerimiento para consultar su detalle.');
    }

    const response = await get(`${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(id)}`);
    const result = response.data;

    if (
        result?.isSuccess !== true
        || !result.data
        || typeof result.data !== 'object'
        || Array.isArray(result.data)
    ) {
        const error = new Error(
            result?.message || 'La respuesta del requerimiento no tiene el formato esperado.'
        );
        error.response = { data: result };
        throw error;
    }

    return { ...response, data: toDetailRecord(result.data) };
}

async function toAttachmentDto(file) {
    const source = file?.originFileObj ?? file;
    if (!(source instanceof Blob)) {
        throw new Error(`No se pudo leer el archivo "${file?.name ?? 'adjunto'}".`);
    }

    const content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result ?? '');
            const separator = result.indexOf(',');
            if (separator < 0) {
                reject(new Error(`No se pudo convertir el archivo "${file?.name ?? 'adjunto'}".`));
                return;
            }
            resolve(result.slice(separator + 1));
        };
        reader.onerror = () => reject(
            reader.error ?? new Error(`No se pudo leer el archivo "${file?.name ?? 'adjunto'}".`)
        );
        reader.readAsDataURL(source);
    });

    return {
        fileName: source.name ?? file.name,
        contentType: source.type || 'application/octet-stream',
        content,
    };
}

function omitUndefined(values) {
    return Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== undefined)
    );
}

async function buildCreateRequest(values) {
    const movementType = values.movementType;
    let endpoint;
    let request;

    if (movementType === 'CHANGE_DEP_SHIFT') {
        if (values.employeeId === undefined || values.employeeId === null) {
            throw new Error('Debe seleccionar un empleado para el cambio de departamento o turno.');
        }
        endpoint = CREATE_ENDPOINTS.CHANGE_DEP_SHIFT;
        request = {
            employeeId: values.employeeId,
            newPlant: values.newPlant,
            newShift: values.newShift,
            newDepartment: values.newDepartment,
            newSupervisor: values.newSupervisor,
            newArea: values.newArea,
            effectiveDate: values.effectiveDate,
        };
    } else if (movementType === 'VACATION') {
        endpoint = CREATE_ENDPOINTS.VACATION;
        request = {
            startDate: values.vacationStartDate,
            endDate: values.vacationEndDate,
            returnDate: values.vacationReturnDate,
            vacationDays: values.vacationDays,
        };
    } else if (movementType === 'PERMISSION') {
        endpoint = CREATE_ENDPOINTS.PERMISSION;
        request = {
            permissionType: values.permissionType,
            startDate: values.permissionStartDate,
            endDate: values.permissionEndDate,
            returnDate: values.permissionReturnDate,
            permissionDays: values.permissionDays,
            swapDetail: values.swapDetail,
            comments: values.comments,
            attachments: Array.isArray(values.attachments)
                ? await Promise.all(values.attachments.map(toAttachmentDto))
                : undefined,
        };
    } else if (movementType === 'TIME_ADJUSTMENT') {
        endpoint = CREATE_ENDPOINTS.TIME_ADJUSTMENT;
        request = {
            adjustmentDate: values.adjustmentDate,
            missingPunchType: values.missingPunchType,
            entryTime: values.missingPunchType === 2 ? undefined : values.entryTime,
            exitTime: values.missingPunchType === 1 ? undefined : values.exitTime,
            justification: values.justification,
        };
    } else {
        throw new Error(`Tipo de formato no soportado: ${movementType ?? 'sin especificar'}.`);
    }

    return { endpoint, payload: toPayload(omitUndefined(request)) };
}

export async function create(values) {
    const { endpoint, payload } = await buildCreateRequest(values);
    const response = await post(endpoint, payload);
    const result = response.data;

    if (result?.isSuccess === false) {
        const error = new Error(result.message || 'No fue posible crear la solicitud.');
        error.response = { data: result };
        throw error;
    }

    if (result?.isSuccess === true && Object.hasOwn(result, 'data')) {
        return { ...response, data: result.data };
    }

    return response;
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
    const response = await get('employee-info/employee-info');
    const result = response.data;

    if (!result?.isSuccess || !result.data) {
        throw new Error(result?.message || 'No fue posible obtener los datos del empleado.');
    }

    return { ...response, data: result.data };
}
