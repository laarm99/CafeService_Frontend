import { get } from '../../../services/backend-requests';

export async function Login() {
    return await get('auth/login');
}