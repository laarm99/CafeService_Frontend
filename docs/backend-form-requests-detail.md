# Contrato backend para el detalle de Formato Multiple

Este contrato permite al frontend consultar el detalle de un requerimiento por
su identificador. La pantalla ya consume el listado con `GET /api/form-requests`
y espera que el detalle use la misma colección de recursos.

## Endpoint requerido

```http
GET /api/form-requests/{id}
Accept: application/json
```

- `{id}` es el identificador numérico del registro que devolvió el listado.
- La URL base del frontend ya contiene `/api`; por eso el cliente agrega
  `form-requests/{id}`.
- Mantener la autenticación y autorización actuales del backend. Responder
  `401` si no hay sesión, `403` si el usuario no tiene permiso y `404` si el
  registro no existe o no es visible para ese usuario.
- Para errores de negocio se puede mantener el formato de error estándar del
  backend. Una respuesta exitosa debe usar el envelope `{ isSuccess, data }`.

## Envelope de respuesta

La propiedad `data` debe ser un objeto, no una lista:

```json
{
  "isSuccess": true,
  "data": {
    "id": 12,
    "employeeId": 3,
    "employeeNumber": "152396",
    "employeeFullName": "LARA ARMENDARIZ JOSE LUIS",
    "domainUserName": "larajl",
    "formType": 1,
    "status": 2,
    "createdDate": "2026-10-15T14:03:13.7672376",
    "submittedDate": "2026-10-15T14:05:00",
    "approver": {
      "id": 25,
      "name": "Nombre del supervisor",
      "position": "Puesto del aprobador"
    },
    "comments": null,
    "effectiveDate": null,
    "newPlant": null,
    "newShift": null,
    "newDepartment": null,
    "newSupervisor": null,
    "vacationDays": 5,
    "startDate": "2026-11-02",
    "endDate": "2026-11-06",
    "returnDate": "2026-11-09",
    "permissionType": null,
    "permissionDays": null,
    "swapDetail": null
  }
}
```

Los campos ajenos al tipo del formato pueden ser `null` o no enviarse. Para
facilitar compatibilidad, las fechas deben enviarse en ISO 8601. El frontend
admite `createdDate`/`createdAt`, `submittedDate`/`submittedAt`,
`employeeFullName`/`fullName` y `employeeNumber`/`clockNumber`.

## Enumeraciones

Usar los valores numéricos ya definidos por el backend:

| `formType` | Tipo |
|---:|---|
| 1 | Vacation |
| 2 | Permission |
| 3 | TimeAdjustment |
| 4 | DepartmentShiftChange |

| `status` | Estado |
|---:|---|
| 1 | Draft |
| 2 | Submitted |
| 3 | Approved |
| 4 | Rejected |
| 5 | Cancelled |

El frontend convierte esos códigos a `VACATION`, `PERMISSION`,
`TIME_ADJUSTMENT`, `CHANGE_DEP_SHIFT` y `DRAFT`, `SUBMITTED`, `APPROVED`,
`REJECTED`, `CANCELLED`, respectivamente.

## Campos específicos por formato

Los siguientes nombres son los que el frontend espera en `data`:

### Vacation (`formType: 1`)

- `vacationDays` (número)
- `startDate`, `endDate`, `returnDate` (fecha)

### Permission (`formType: 2`)

- `permissionType` (1 matrimonio, 2 nacimiento, 3 defunción, 4 permiso sin
  goce, 5 intercambio)
- `permissionDays` (número)
- `startDate`, `endDate`, `returnDate` (fecha)
- `swapDetail` (texto o `null`)
- Los adjuntos persistidos no forman parte de la respuesta de detalle.

### TimeAdjustment (`formType: 3`)

- `adjustmentDate` (fecha)
- `missingPunchType` (1 entrada, 2 salida, 3 ambas)
- `entryTime`, `exitTime` (hora o `null`)
- `justification` (texto)

### DepartmentShiftChange (`formType: 4`)

- `employeeId`
- `effectiveDate` (fecha)
- `newPlant`, `newShift`, `newDepartment`, `newSupervisor`

## Aprobación

- `approver`: objeto que representa al supervisor asignado, con forma
  `{ id, name, position }`. Es el único dato de aprobación que devuelve este
  endpoint.
- No devolver `decisionBy`, `decisionDate`, `decisionComment` ni adjuntos
  persistidos.
- `comments` puede incluir un comentario general de la solicitud o ser `null`;
  no representa una decisión del supervisor.

## Ejemplos mínimos para probar

```http
GET /api/form-requests/12
```

Debe devolver `200 OK` y un envelope exitoso. Para un id inexistente, devolver
`404 Not Found`; no devolver `200` con `data: null`.
