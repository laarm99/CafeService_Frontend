// Unico punto de contacto con el backend para Formato Multiple.
// Todas las operaciones usan los endpoints reales del backend.

import { get, post } from '../../../services/backend-requests';
import { toDetailRecord, toPayload } from '../mappers/multiFormat.mapper';

const RESOURCE_ROOT = 'MultiFormat';
const FORM_REQUESTS_ENDPOINT = 'form-requests';
const CREATE_ENDPOINTS = {
    CHANGE_DEP_SHIFT: 'changes-department-or-shift/create-change-request',
    PERMISSION: 'permission-request/create-permission-request',
    TIME_ADJUSTMENT: 'time-adjustment-request/create-time-adjustment-request',
    VACATION: 'vacation-request/create-vacation-request',
};

export async function getAll(params = {}) {
    const response = await get(FORM_REQUESTS_ENDPOINT, { params });
    const result = response.data;

    // El listado paginado devuelve { items, page, pageSize, totalCount, totalPages }
    const page = Array.isArray(result?.data) ? { items: result.data } : result?.data;

    if (result?.isSuccess !== true || !Array.isArray(page?.items)) {
        const error = new Error(
            result?.message || 'La respuesta de requerimientos no tiene el formato esperado.'
        );
        error.response = { data: result };
        throw error;
    }

    return { ...response, data: page };
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
            employeeId: values.employeeId,
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

    const payload = toPayload(omitUndefined(request));
    // toPayload solo conserva metadatos de adjuntos; en la creacion se
    // envia el contenido (base64) para que el backend guarde el archivo.
    if (movementType === 'PERMISSION' && Array.isArray(request.attachments)) {
        payload.attachments = request.attachments;
    }

    return { endpoint, payload };
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

// La edicion no esta soportada: la solicitud se cancela y se vuelve a crear.
export async function update() {
    throw new Error('La edicion de solicitudes no esta soportada.');
}

// El creador cancela su propia solicitud mientras siga en estado Enviado.
export async function cancel(id) {
    const response = await post(`${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(id)}/cancel`, {});
    const result = response.data;

    if (result?.isSuccess !== true) {
        const error = new Error(result?.message || 'No fue posible cancelar la solicitud.');
        error.response = { status: result?.statusCode ?? response.status, data: result };
        throw error;
    }

    return await getById(id);
}

// --- Acciones del aprobador -------------------------------------------------
// Cuando existan roles, el backend validara que quien llama tenga permiso.

// Acciones del aprobador. El backend exige rol Supervisor, empleado a su cargo,
// solicitud Submitted de tipo DepartmentShiftChange y que no sea la propia.
async function decide(id, action, comment) {
    const response = await post(
        `${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(id)}/${action}`,
        { comments: comment?.trim() ? comment.trim() : null }
    );
    const result = response.data;

    if (result?.isSuccess !== true) {
        const error = new Error(result?.message || 'No fue posible completar la operacion.');
        error.response = { status: result?.statusCode ?? response.status, data: result };
        throw error;
    }

    // El endpoint solo devuelve true: se recarga el detalle actualizado
    return await getById(id);
}

export async function approve(id, comment) {
    return await decide(id, 'approve', comment);
}

export async function reject(id, comment) {
    return await decide(id, 'reject', comment);
}

// El Admin marca como terminada una solicitud aprobada por el supervisor.
export async function complete(id) {
    const response = await post(`${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(id)}/complete`, {});
    const result = response.data;

    if (result?.isSuccess !== true) {
        const error = new Error(result?.message || 'No fue posible completar la operacion.');
        error.response = { status: result?.statusCode ?? response.status, data: result };
        throw error;
    }

    return await getById(id);
}

// Descarga el PDF del formato (solo Admin; aprobado o completado).
// Con responseType 'blob' el cuerpo del error llega como Blob: se vuelve a leer como JSON.
async function rethrowBlobError(error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
        try {
            error.response.data = JSON.parse(await data.text());
        } catch {
            error.response.data = null;
        }
    }
    throw error;
}

function saveBlob(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export async function downloadAttachment(requestId, attachment) {
    const response = await get(
        `${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(requestId)}/attachments/${encodeURIComponent(attachment.id)}`,
        { responseType: 'blob' }
    ).catch(rethrowBlobError);
    saveBlob(response.data, attachment.name || attachment.fileName || 'adjunto');
}

export async function downloadPdf(id) {
    const response = await get(
        `${FORM_REQUESTS_ENDPOINT}/${encodeURIComponent(id)}/pdf`,
        { responseType: 'blob', headers: { Accept: 'application/pdf' } }
    ).catch(rethrowBlobError);

    saveBlob(response.data, `formato-multiple-${id}.pdf`);
}

export async function getCurrentEmployee() {
    const response = await get('employee-info/employee-info');
    const result = response.data;

    if (!result?.isSuccess || !result.data) {
        throw new Error(result?.message || 'No fue posible obtener los datos del empleado.');
    }

    return { ...response, data: result.data };
}
