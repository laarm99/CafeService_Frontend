import { get } from "../../../services/backend-requests";

// Expected contract:
// GET VITE_MANAGED_EMPLOYEES_ENDPOINT, scoped by the backend to the
// authenticated user's direct reports. Response: { isSuccess: true, data: [{
//   id: MFR_EMPLOYEES.ID, fullName, employeeNumber, domainUser?,
//   plant?, shift?, department?, supervisorName?, area?
// }] }. Configure the endpoint after the backend confirms its route.
export async function getManagedEmployees() {
    const endpoint = import.meta.env.VITE_MANAGED_EMPLOYEES_ENDPOINT;
    if (!endpoint) {
        throw new Error("VITE_MANAGED_EMPLOYEES_ENDPOINT no está configurado.");
    }

    const response = await get(endpoint);
    const result = response.data;

    if (result?.isSuccess !== true || !Array.isArray(result.data)) {
        throw new Error(
            result?.message || "La respuesta de empleados a cargo no tiene el formato esperado."
        );
    }

    const hasInvalidEmployee = result.data.some((employee) => (
        employee?.id === undefined
        || employee?.id === null
        || !employee?.fullName
        || employee?.employeeNumber === undefined
        || employee?.employeeNumber === null
    ));
    if (hasInvalidEmployee) {
        throw new Error(
            "La respuesta de empleados a cargo debe incluir id, fullName y employeeNumber."
        );
    }

    return { ...response, data: result.data };
}
