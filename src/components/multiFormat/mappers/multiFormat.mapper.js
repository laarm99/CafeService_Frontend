// Traduccion entre lo que maneja Ant Design (dayjs, fileList, nombres del Form)
// y lo que espera / devuelve el backend.
// Toda conversion de fechas vive AQUI: si el back cambia de formato, se toca
// un solo archivo.

import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';

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

    // El Upload de antd entrega objetos de archivo; al back solo le mandamos
    // los ids/nombres. Cuando exista el endpoint de adjuntos se cambia aqui.
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

// Backend -> Grid. Garantiza la 'key' que exige la Table de Ant Design.
export function toRow(record = {}) {
    return {
        ...record,
        key: record.key ?? String(record.id),
    };
}
