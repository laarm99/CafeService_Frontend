/**
 * Pruebas para validar el sistema de múltiples roles
 * Ejecutar: node tests/permissions.test.js
 */

import { getPermissions, ROLES } from "../src/utils/permissions.js";

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(`❌ ${message}`);
    }
}

// Pruebas: Rol Único (Compatibilidad Actual)

test("Admin con rol string (actual)", () => {
    const perms = getPermissions({ role: ROLES.ADMIN });
    assert(perms.canViewConfiguration === true, "Admin debe ver configuración");
    assert(perms.canApproveRequests === false, "Admin no aprueba");
    assert(perms.hasMultipleRoles === false, "Rol único");
});

test("Supervisor con rol string (actual)", () => {
    const perms = getPermissions({ role: ROLES.SUPERVISOR });
    assert(perms.canApproveRequests === true, "Supervisor aprueba");
    assert(perms.canViewConfiguration === false, "Supervisor no ve config");
    assert(perms.hasMultipleRoles === false, "Rol único");
});

test("GeneralUser con rol string (actual)", () => {
    const perms = getPermissions({ role: ROLES.GENERAL });
    assert(perms.canCreateForms === true, "General puede crear");
    assert(perms.canApproveRequests === false, "General no aprueba");
    assert(perms.canViewConfiguration === false, "General no ve config");
});

// Pruebas: Múltiples Roles (Futuro)

test("Admin+Supervisor con roles array", () => {
    const perms = getPermissions({ roles: [ROLES.ADMIN, ROLES.SUPERVISOR] });
    assert(perms.canViewConfiguration === true, "Tiene Admin");
    assert(perms.canApproveRequests === true, "Tiene Supervisor");
    assert(perms.hasMultipleRoles === true, "Múltiples roles");
    assert(perms.requiresApprovalForOwnRequest === true, "Sus propios requieren aprobación");
});

test("Solo Admin con roles array", () => {
    const perms = getPermissions({ roles: [ROLES.ADMIN] });
    assert(perms.canViewConfiguration === true, "Tiene Admin");
    assert(perms.canApproveRequests === false, "No tiene Supervisor");
    assert(perms.hasMultipleRoles === false, "Un solo rol");
    assert(perms.requiresApprovalForOwnRequest === false, "No requiere aprobación");
});

test("Solo Supervisor con roles array", () => {
    const perms = getPermissions({ roles: [ROLES.SUPERVISOR] });
    assert(perms.canApproveRequests === true, "Tiene Supervisor");
    assert(perms.canViewConfiguration === false, "No tiene Admin");
    assert(perms.hasMultipleRoles === false, "Un solo rol");
});

test("Admin+Supervisor+GeneralUser (caso extremo)", () => {
    const perms = getPermissions({
        roles: [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.GENERAL]
    });
    assert(perms.canViewConfiguration === true, "Tiene Admin");
    assert(perms.canApproveRequests === true, "Tiene Supervisor");
    assert(perms.canCreateForms === true, "Tiene General");
    assert(perms.hasMultipleRoles === true, "Múltiples roles");
});

// Pruebas: Sin Rol

test("Usuario sin rol", () => {
    const perms = getPermissions({ role: null });
    assert(perms.canViewForms === false, "Sin acceso");
    assert(perms.canViewConfiguration === false, "Sin acceso");
    assert(perms.hasMultipleRoles === false, "Sin roles");
});

test("Usuario null", () => {
    const perms = getPermissions(null);
    assert(perms.canViewForms === false, "Sin acceso");
    assert(perms.hasMultipleRoles === false, "Sin roles");
});

test("Usuario vacío", () => {
    const perms = getPermissions({});
    assert(perms.canViewForms === false, "Sin acceso");
    assert(perms.hasMultipleRoles === false, "Sin roles");
});

// Ejecutar pruebas

console.log("🧪 Ejecutando pruebas de permisos...\n");

let passed = 0;
let failed = 0;

for (const { name, fn } of tests) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`${error.message}`);
        failed++;
    }
}

console.log(`\n📊 Resultados: ${passed} pasadas, ${failed} fallidas`);

if (failed > 0) {
    process.exit(1);
}
