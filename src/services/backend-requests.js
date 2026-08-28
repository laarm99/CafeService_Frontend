import axios from 'axios'
import { formatErrorsToFormFields } from '../utils/response-utils';

//const virtualDir=process.env.REACT_APP_VIRTUAL_DIR;
//Falta crear los archivos de entorno .env.
async function ensureToken() {
    let token = localStorage.getItem("token");
    if (!token) {
        console.warn("Token no encontrado en localStorage. Esperando...");
        // Esperar a que el token esté disponible (opcional: agregar un límite de tiempo)
        while (!token) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Retraso de 100ms
            token = localStorage.getItem("token");
        }
    }
    return token;
}
function createAxiosClient() {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json', // Establece un valor predeterminado
        },
    });
    instance.interceptors.request.use(async (config) => {
        const token = localStorage.getItem("token"); // Obtén el token dinámicamente
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        else {
            console.log("Token no encontrado en el localStorage")
        }
        config.headers['Accept-Language'] = 'en'; // Idioma
        return config;
    });
    instance.interceptors.response.use(
        (response) => response,
        (response_error) => {
            console.log('response_error', response_error);
            response_error['fieldErrors'] = [];

            const response = response_error.response;
            if (!response) return Promise.reject(response_error);
            const data = response.data;

            if (response && response.status == 401) {
                localStorage.removeItem("token");
                console.log("No se puede autenticar")
            }

            if (data && data.errors) {
                response_error['fieldErrors'] = formatErrorsToFormFields(data.errors);

            }
            return Promise.reject(response_error);
        }
    );
    return instance;
}

export async function get(relative_url) {
    return await createAxiosClient().get(relative_url);
}
export async function post(relative_url, body) {
    return await createAxiosClient().post(relative_url, body);
}
export async function put(relative_url, body, config) {
    return await createAxiosClient().put(relative_url, body, config);
}
export async function del(relative_url) {
    return await createAxiosClient().delete(relative_url);
}