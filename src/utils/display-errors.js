import { notifyError } from "./messages";

export function getErrorMessage(error) {
    const data = error?.response?.data;
    const title = data?.title;
    const details = data?.detail;
    const nfe = data?.errors?.non_field_errors;

    if (title || details) return [title, details].filter(Boolean).join(" - ");
    if (data?.message) return data.message;
    if (nfe?.length > 0) return nfe[0];

    // Errores de validación por campo: "Campo: mensaje"
    if (data?.errors && typeof data.errors === "object") {
        const first = Object.values(data.errors).flat().find(Boolean);
        if (first) return String(first);
    }

    return error?.message || "Ocurrió un error inesperado.";
}

export default function displayError(error){
    notifyError(getErrorMessage(error));
};