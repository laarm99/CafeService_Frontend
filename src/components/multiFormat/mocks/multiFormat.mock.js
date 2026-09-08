// Datos dummy para la demo del front.
// Simula latencia y responde con la MISMA forma que axios ({ data, status }),
// para que al conectar el backend no haya que tocar hooks ni componentes.
//
// IMPORTANTE: los mocks guardan CODIGOS (movementType, status), no textos.
// El texto visible lo resuelve i18next, asi la pantalla es bilingue.
//
// FLUJO DE APROBACION (dummy, sin roles todavia):
//   SUBMITTED -> APPROVED | REJECTED
//   El aprobador se asigna al enviar. Cuando existan roles y permisos,
//   esta asignacion la debera resolver el backend.

const DELAY_MS = 350;

const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const ok = (data, status = 200) => ({ data, status });

export const STATUS = {
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

// Aprobador dummy. Cuando existan roles, el backend devolvera el real
// segun las reglas definidas (departamento, tipo de movimiento, etc.).
export const MOCK_APPROVER = {
    id: 99,
    name: 'Laura Mendoza',
    position: 'Gerente de Recursos Humanos',
};

export const MOCK_CATALOGS = {
    movementTypes: [
        { labelKey: 'multiFormat.movement.CHANGE_DEP_SHIFT', value: 'CHANGE_DEP_SHIFT' },
        { labelKey: 'multiFormat.movement.VACATION', value: 'VACATION' },
        { labelKey: 'multiFormat.movement.PERMISSION', value: 'PERMISSION' },
    ],
    plants: [
        { label: 'J1', value: 1 },
        { label: 'J2', value: 2 },
    ],
    departments: [
        { label: 'Information Technology', value: 1 },
        { label: 'Produccion', value: 2 },
        { label: 'Calidad', value: 3 },
        { label: 'Recursos Humanos', value: 4 },
    ],
    shifts: [
        { label: '1er Turno', value: 1 },
        { label: '2do Turno', value: 2 },
        { label: '3er Turno', value: 3 },
    ],
    statuses: [
        { labelKey: 'multiFormat.status.SUBMITTED', value: STATUS.SUBMITTED },
        { labelKey: 'multiFormat.status.APPROVED', value: STATUS.APPROVED },
        { labelKey: 'multiFormat.status.REJECTED', value: STATUS.REJECTED },
    ],
};

// Empleado dummy: cuando exista el endpoint lo devolvera
// /MultiFormat/currentEmployee.
export const MOCK_CURRENT_EMPLOYEE = {
    clockNumber: '123456',
    fullName: 'Jose Luis Lara Armendariz',
    netkey: 'larajl',
    position: 'IT Engineer',
    department: 'Information Technology',
    plant: 'J1',
    shift: '1er Turno',
    supervisor: 'Miguel A. Crispin',
    area: 'Sistemas',
    hireDate: '2021-03-15',
};

// "Base de datos" en memoria: se muta con create / approve / reject
// para que la demo se sienta real.
let MOCK_DB = [
    {
        key: '1',
        id: 1,
        createdAt: '2026-01-15',
        submittedAt: '2026-01-15',
        fullName: 'Juan Perez',
        netkey: 'jperez01',
        clockNumber: '100201',
        movementType: 'VACATION',
        status: STATUS.SUBMITTED,
        approver: MOCK_APPROVER,
        vacationDays: 5,
        vacationStartDate: '2026-02-02',
        vacationEndDate: '2026-02-06',
        vacationReturnDate: '2026-02-09',
    },
    {
        key: '2',
        id: 2,
        createdAt: '2026-01-18',
        submittedAt: '2026-01-18',
        fullName: 'Maria Gonzalez',
        netkey: 'mgonza02',
        clockNumber: '100455',
        movementType: 'PERMISSION',
        status: STATUS.APPROVED,
        approver: MOCK_APPROVER,
        permissionType: 1,
        permissionDays: 3,
        permissionStartDate: '2026-01-25',
        permissionEndDate: '2026-01-27',
        permissionReturnDate: '2026-01-28',
        decisionBy: MOCK_APPROVER.name,
        decisionAt: '2026-01-19',
        decisionComment: 'Procede conforme a politica.',
    },
    {
        key: '3',
        id: 3,
        createdAt: '2026-01-20',
        submittedAt: '2026-01-20',
        fullName: 'Carlos Ramirez',
        netkey: 'cramir03',
        clockNumber: '100788',
        movementType: 'CHANGE_DEP_SHIFT',
        status: STATUS.REJECTED,
        approver: MOCK_APPROVER,
        effectiveDate: '2026-02-01',
        newPlant: 'J2',
        newShift: '2do Turno',
        newDepartment: 'Calidad',
        newSupervisor: 'Rosa Delgado',
        newArea: 'Inspeccion',
        decisionBy: MOCK_APPROVER.name,
        decisionAt: '2026-01-21',
        decisionComment: 'No hay vacante disponible en el turno solicitado.',
    },
    {
        key: '4',
        id: 4,
        createdAt: '2026-01-22',
        submittedAt: '2026-01-22',
        fullName: 'Ana Lopez',
        netkey: 'alopez04',
        clockNumber: '100912',
        movementType: 'VACATION',
        status: STATUS.SUBMITTED,
        approver: MOCK_APPROVER,
        vacationDays: 10,
        vacationStartDate: '2026-02-16',
        vacationEndDate: '2026-02-27',
        vacationReturnDate: '2026-03-02',
    },
    {
        key: '5',
        id: 5,
        createdAt: '2026-01-25',
        submittedAt: '2026-01-25',
        fullName: 'Luis Martinez',
        netkey: 'lmarti05',
        clockNumber: '101044',
        movementType: 'PERMISSION',
        status: STATUS.APPROVED,
        approver: MOCK_APPROVER,
        permissionType: 4,
        permissionDays: 1,
        permissionStartDate: '2026-02-03',
        permissionEndDate: '2026-02-03',
        permissionReturnDate: '2026-02-04',
        decisionBy: MOCK_APPROVER.name,
        decisionAt: '2026-01-26',
    },
];

const nextId = () => MOCK_DB.reduce((max, r) => Math.max(max, r.id), 0) + 1;

const today = () => new Date().toISOString().slice(0, 10);

// Error con la MISMA forma que un 400 de FluentValidation / ValidationProblemDetails,
// para poder probar el pintado de errores por campo sin backend.
const buildValidationError = (errors) => {
    const error = new Error('Validation failed');
    error.response = {
        status: 400,
        data: {
            title: 'Errores de validacion. ',
            detail: 'Revise los campos marcados.',
            errors,
        },
    };
    return error;
};

const buildNotFoundError = (id) => {
    const error = new Error('Not found');
    error.response = {
        status: 404,
        data: { title: 'No encontrado. ', detail: `No existe el formato ${id}.` },
    };
    return error;
};

const buildConflictError = (detail) => {
    const error = new Error('Conflict');
    error.response = {
        status: 409,
        data: { title: 'Operacion no permitida. ', detail },
    };
    return error;
};

export async function getAllMock() {
    await delay();
    return ok([...MOCK_DB]);
}

export async function getByIdMock(id) {
    await delay();
    const found = MOCK_DB.find((r) => String(r.id) === String(id));
    if (!found) throw buildNotFoundError(id);
    return ok({ ...found });
}

// Enviar = crear. El formato nace en estado SUBMITTED y ya no es editable.
export async function createMock(payload) {
    await delay();

    // Simulacion de la validacion del back (se elimina cuando exista el endpoint).
    // La fecha efectiva solo aplica al cambio de departamento y/o turno.
    if (payload?.movementType === 'CHANGE_DEP_SHIFT' && !payload?.effectiveDate) {
        throw buildValidationError({ effectiveDate: ['La fecha efectiva es requerida.'] });
    }

    const id = nextId();
    const record = {
        ...payload,
        key: String(id),
        id,
        createdAt: today(),
        submittedAt: today(),
        fullName: payload.fullName ?? MOCK_CURRENT_EMPLOYEE.fullName,
        netkey: payload.netkey ?? MOCK_CURRENT_EMPLOYEE.netkey,
        status: STATUS.SUBMITTED,
        approver: { ...MOCK_APPROVER },
    };
    MOCK_DB = [record, ...MOCK_DB];
    return ok(record, 201);
}

export async function updateMock(id, payload) {
    await delay();
    const current = MOCK_DB.find((r) => String(r.id) === String(id));
    if (!current) throw buildNotFoundError(id);

    // Una vez enviado, el creador ya no puede modificarlo
    if (current.status) {
        throw buildConflictError('El formato ya fue enviado y no puede modificarse.');
    }

    let updated = null;
    MOCK_DB = MOCK_DB.map((r) => {
        if (String(r.id) !== String(id)) return r;
        updated = { ...r, ...payload };
        return updated;
    });
    return ok(updated);
}

export async function removeMock(id) {
    await delay();
    MOCK_DB = MOCK_DB.filter((r) => String(r.id) !== String(id));
    return ok(null, 204);
}

// --- Acciones del aprobador -------------------------------------------------

function applyDecision(id, status, comment) {
    const current = MOCK_DB.find((r) => String(r.id) === String(id));
    if (!current) throw buildNotFoundError(id);

    if (current.status !== STATUS.SUBMITTED) {
        throw buildConflictError('El formato ya fue atendido por el aprobador.');
    }

    const updated = {
        ...current,
        status,
        decisionBy: current.approver?.name ?? MOCK_APPROVER.name,
        decisionAt: today(),
        decisionComment: comment?.trim() ? comment.trim() : null,
    };

    MOCK_DB = MOCK_DB.map((r) => (String(r.id) === String(id) ? updated : r));
    return updated;
}

export async function approveMock(id, comment) {
    await delay();
    // En aprobacion el comentario es opcional
    return ok(applyDecision(id, STATUS.APPROVED, comment));
}

export async function rejectMock(id, comment) {
    await delay();

    // En rechazo el comentario es obligatorio
    if (!comment || !comment.trim()) {
        throw buildValidationError({ comment: ['El comentario es obligatorio para rechazar.'] });
    }

    return ok(applyDecision(id, STATUS.REJECTED, comment));
}

export async function getApproverMock() {
    await delay(150);
    return ok({ ...MOCK_APPROVER });
}

export async function getCatalogsMock() {
    await delay(150);
    return ok(MOCK_CATALOGS);
}

export async function getCurrentEmployeeMock() {
    await delay(150);
    return ok({ ...MOCK_CURRENT_EMPLOYEE });
}
