# Migración: Sistema de Roles Múltiples

**Fecha:** 2026-10-21  
**Estado:** Frontend listo para múltiples roles - Pendiente cambios backend

## 📋 Resumen de Cambios en Frontend

El frontend ha sido actualizado para **soportar múltiples roles por usuario**, manteniendo compatibilidad con la estructura actual (rol singular).

### Cambios Realizados

#### 1. `src/utils/permissions.js`
- ✅ Ahora soporta roles como **array** o como **string**
- ✅ Función `normalizeRoles()` que convierte automáticamente
- ✅ Nuevos permisos:
  - `hasMultipleRoles`: indica si el usuario tiene múltiples roles
  - `requiresApprovalForOwnRequest`: True si Admin + Supervisor (sus propios requests necesitan aprobación)

#### 2. `src/types/user.types.js` (nuevo)
- Definición de tipos JSDoc para la estructura de usuario
- Documentación clara de campos actuales vs futuros

### Cambios en Backend (Próximos)

#### Opción A: Cambio Gradual (Recomendado)

**Fase 1 (Ahora):**
```json
{
  "domainUserName": "user123",
  "isActive": true,
  "role": "Admin"
}
```

**Fase 2 (Próximo):**
```json
{
  "domainUserName": "user123",
  "isActive": true,
  "role": "Admin",
  "roles": ["Admin"]
}
```

**Fase 3 (Futuro):**
```json
{
  "domainUserName": "user123",
  "isActive": true,
  "roles": ["Admin", "Supervisor"]
}
```

#### Opción B: Cambio Directo
Ir directamente a `roles` como array. El frontend funcionará sin cambios.

---

## 🔄 Transición Paso a Paso

### Paso 1: Actualizar Endpoint `/auth/login`

El endpoint **debe devolver `roles` como array**:

```javascript
// BACKEND - GET /auth/login
{
  "domainUserName": "user123",
  "isActive": true,
  "roles": ["Admin", "Supervisor"],  // Array de roles
  "id": "uuid-123",
  "email": "user@company.com"
}
```

### Paso 2: Actualizar Endpoint `/configuration/users`

Listar usuarios con múltiples roles:

```javascript
// BACKEND - GET /configuration/users
{
  "data": [
    {
      "id": "123",
      "domainUserName": "jperez",
      "isActive": true,
      "roles": ["Supervisor"],
      "email": "jperez@company.com"
    },
    {
      "id": "124",
      "domainUserName": "alopez",
      "isActive": true,
      "roles": ["Admin", "Supervisor"],
      "email": "alopez@company.com"
    }
  ],
  "pagination": { "total": 100, "page": 1, "pageSize": 10 }
}
```

### Paso 3: Actualizar Endpoint `/configuration/users/{userId}/roles`

Permitir asignar múltiples roles a un usuario:

```javascript
// BACKEND - PUT /configuration/users/124/roles
// Request:
{
  "roles": ["Admin", "Supervisor"]
}

// Response:
{
  "success": true,
  "user": {
    "id": "124",
    "domainUserName": "alopez",
    "isActive": true,
    "roles": ["Admin", "Supervisor"]
  }
}
```

---

## 🎯 Casos de Uso: Admin + Supervisor

### Caso 1: Usuario con Admin + Supervisor

**Estructura:**
```json
{
  "domainUserName": "carlos",
  "roles": ["Admin", "Supervisor"]
}
```

**Permisos resultantes:**
```javascript
{
  canViewForms: true,
  canCreateForms: true,
  canViewConfiguration: true,      // Por Admin
  canManageSupervisors: true,       // Por Admin
  canManageUsers: true,             // Por Admin
  canApproveRequests: true,         // Por Supervisor
  hasMultipleRoles: true,
  requiresApprovalForOwnRequest: true  // ⚠️ Sus propios formatos necesitan aprobación
}
```

### Caso 2: Un Supervisor debe aprobar el formato de Admin+Supervisor

**Flujo:**
1. Carlos (Admin+Supervisor) crea un formato
2. El formulario le advierte: "Este formato requiere aprobación de otro Supervisor"
3. Otro Supervisor aprueba
4. El formato se completa

---

## 🧪 Pruebas de Validación

```javascript
// Antes (rol único)
const perms = getPermissions({ role: "Admin" });
// Funciona ✓

// Ahora (múltiples roles)
const perms = getPermissions({ roles: ["Admin", "Supervisor"] });
// Funciona ✓

// Compatibilidad (rol único, nuevo formato)
const perms = getPermissions({ roles: ["Admin"] });
// Funciona ✓
```

---

## 📝 Checklist para Backend

- [ ] Cambiar `/auth/login` para devolver `roles: string[]`
- [ ] Cambiar `/configuration/users` para devolver `roles: string[]`
- [ ] Crear/actualizar endpoint `/configuration/users/{userId}/roles` (PUT)
- [ ] Validar en backend que:
  - Un usuario debe tener al menos un rol
  - Los roles válidos son: "Admin", "Supervisor", "GeneralUser"
  - No se puede tener "Admin" + "GeneralUser" simultáneamente
- [ ] Validar aprobación cuando usuario tiene Admin+Supervisor

---

## 🔒 Validaciones Backend Recomendadas

```javascript
// Al aprobar un formato
if (user.roles.includes("Supervisor")) {
    const isOwnRequest = format.createdBy === user.id;
    const hasAdminRole = user.roles.includes("Admin");

    if (isOwnRequest && hasAdminRole) {
        // Requerir aprobación de otro Supervisor
        throw new Error("Tu formato requiere aprobación de otro Supervisor");
    }
    // Permitir aprobación
}
```

---

## 📞 Próximos Pasos

1. Backend implementa cambios según este documento
2. Frontend automáticamente soportará múltiples roles
3. Las páginas de Supervisores y Usuarios mostrarán roles como chips
4. Los filtros y validaciones funcionarán automáticamente
