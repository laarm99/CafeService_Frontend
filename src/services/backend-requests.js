import axios from 'axios'
import { formatErrorsToFormFields } from '../utils/response-utils';

//const virtualDir=process.env.REACT_APP_VIRTUAL_DIR;
//Falta crear los archivos de entorno .env.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,

    // Permite al navegador utilizar las credenciales
    // correspondientes al flujo de Windows Authentication.
    withCredentials: true,

    headers: {
        Accept: "application/json",
    },
});

// Configuración de cada petición.
apiClient.interceptors.request.use((config) => {
    // Respetar el idioma seleccionado en el frontend.
    config.headers["Accept-Language"] =
        localStorage.getItem("language") || "es";

    // No enviar Authorization: Bearer.
    // La autenticación Windows la gestiona el navegador.
    return config;
});

// Manejo de las respuestas y errores del backend.
apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
        const data = error.response?.data;

        // Conservar los errores por campo para los Form de Ant Design.
        error.fieldErrors = data?.errors
            ? formatErrorsToFormFields(data.errors)
            : [];

        // Dejar que quien hizo la petición maneje el error:
        // login, formulario, listado, etc.
        return Promise.reject(error);
    }
);

export async function get(relative_url, config = {}) {
    return await apiClient.get(relative_url, config);
}

export async function post(relative_url, body, config = {}) {
    return await apiClient.post(relative_url, body, config);
}

export async function put(relative_url, body, config = {}) {
    return await apiClient.put(relative_url, body, config);
}

export async function del(relative_url, config = {}) {
    return await apiClient.delete(relative_url, config);
}