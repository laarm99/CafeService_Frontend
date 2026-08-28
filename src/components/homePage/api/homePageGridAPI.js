import { get } from "../../../services/backend-requests";

const RESOURCE_ROOT = '/dashboard';

export async function getAll() {    
    return await get(`${RESOURCE_ROOT}/grid`);
}