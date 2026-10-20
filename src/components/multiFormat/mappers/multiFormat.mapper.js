// Traduccion entre lo que maneja Ant Design (dayjs, fileList, nombres del Form)
// y lo que espera / devuelve el backend.
// Toda conversion de fechas vive AQUI: si el back cambia de formato, se toca
// un solo archivo.

import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';

const FORM_TYPE_BY_ID = {
    1: 'VACATION',
    2: 'PERMISSION',
    3: 'TIME_ADJUSTMENT',
    4: 'CHANGE_DEP_SHIFT',
};

const STATUS_BY_ID = {
    1: 'DRAFT',
    2: 'SUBMITTED',
    3: 'APPROVED',
    4: 'REJECTED',
    5: 'CANCELLED',
};

const isTimeField = (key = '') => /time$/i.test(key);

// Convierte recursivamente cualquier dayjs del formulario a string.
// Los campos cuyo nombre termina en "Time" se mandan como HH:mm:ss.
function normalize(value, key = '') {
    if (value === undefined || value === null) return null;
    if (dayjs.isDayjs(value)) return value.format(isTimeField(key) ? TIME_FORMAT : DATE_FORMAT);
    if (Array.isArray(value)) return value.map((item) => normalize(item, key));
    if (typeof value === 'object' && !(value instanceof File)) {
        return Object.entries(value).reduce((acc, [k, v]) => {
            acc[k] = normalize(v, k);
            return acc;
        }, {});
    }
    return value;
}

// Form (Ant Design) -> Backend
export function toPayload(values = {}) {
    const { attachments, ...rest } = values;

    const payload = normalize(rest);

    // Las actualizaciones conservan metadatos; la creacion convierte los
    // archivos originales al DTO de adjuntos en MultiFormatApi.
    if (Array.isArray(attachments)) {
        payload.attachments = attachments.map((file) => ({
            name: file.name,
            uid: file.uid,
            status: file.status,
            url: file.url ?? file.response?.url ?? null,
        }));
    }

    return payload;
}

// Backend -> Form (Ant Design), para edicion / detalle
export function toFormValues(record = {}) {
    return Object.entries(record).reduce((acc, [key, value]) => {
        if (value && /date$/i.test(key)) {
            acc[key] = dayjs(value);
        } else if (value && isTimeField(key)) {
            acc[key] = dayjs(value, TIME_FORMAT);
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
}

// Backend -> Detail. Adapta el contrato común de form-requests al modelo
// consumido por la pantalla de detalle.
export function toDetailRecord(record = {}) {
    return {
        ...record,
        createdAt: record.createdAt ?? record.createdDate,
        submittedAt: record.submittedAt ?? record.submittedDate,
        clockNumber: record.clockNumber ?? record.employeeNumber,
        fullName: record.fullName ?? record.employeeFullName,
        netkey: record.netkey ?? record.domainUserName,
        movementType: record.movementType
            ?? FORM_TYPE_BY_ID[record.formType]
            ?? record.formType,
        status: STATUS_BY_ID[record.status] ?? record.status,
        vacationStartDate: record.vacationStartDate ?? record.startDate,
        vacationEndDate: record.vacationEndDate ?? record.endDate,
        vacationReturnDate: record.vacationReturnDate ?? record.returnDate,
        permissionStartDate: record.permissionStartDate ?? record.startDate,
        permissionEndDate: record.permissionEndDate ?? record.endDate,
        permissionReturnDate: record.permissionReturnDate ?? record.returnDate,
    };
}

// Backend -> Grid. Garantiza la 'key' que exige la Table de Ant Design.
export function toRow(record = {}) {
    return {
        ...record,
        createdAt: record.createdAt ?? record.createdDate,
        employeeNumber: record.employeeNumber ?? record.clockNumber ?? record.netkey,
        fullName: record.fullName ?? record.employeeFullName,
        movementType: record.movementType
            ?? FORM_TYPE_BY_ID[record.formType]
            ?? record.formType,
        status: STATUS_BY_ID[record.status] ?? record.status,
        key: record.key ?? String(record.id),
    };
}
