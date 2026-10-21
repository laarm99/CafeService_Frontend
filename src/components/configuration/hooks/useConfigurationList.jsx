import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import displayError from '../../../utils/display-errors';
import { notifyError } from '../../../utils/messages';

// Errores de acceso/validacion con texto claro. Si el backend manda su propio
// mensaje en 400/409 (por ejemplo, NetKey duplicado) se muestra ese mensaje.
export function useConfigurationErrors() {
    const { t } = useTranslation();

    return useCallback((error) => {
        const status = error?.response?.status;
        const data = error?.response?.data;
        const backendText = data?.message || data?.title || data?.detail;

        if ((status === 400 || status === 409) && backendText) {
            displayError(error);
            return;
        }

        if ([400, 401, 403, 404, 409].includes(status)) {
            notifyError(t(`configuration.errors.${status}`));
            return;
        }

        displayError(error);
    }, [t]);
}

// Carga una lista de configuracion y ejecuta mutaciones (una a la vez)
// refrescando la tabla despues de cada operacion exitosa.
export default function useConfigurationList(fetcher) {
    const handleError = useConfigurationErrors();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const latestRequest = useRef(0);
    const busy = useRef(false);

    const refresh = useCallback(async () => {
        const requestId = ++latestRequest.current;
        setLoading(true);
        try {
            const rows = await fetcher();
            if (requestId === latestRequest.current) setDataSource(rows);
        } catch (error) {
            if (requestId === latestRequest.current) {
                setDataSource([]);
                handleError(error);
            }
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [fetcher, handleError]);

    useEffect(() => {
        refresh();
        return () => {
            latestRequest.current += 1;
        };
    }, [refresh]);

    // Devuelve true si la operacion termino bien. Ignora envios mientras hay otro en proceso.
    const mutate = useCallback(async (id, operation) => {
        if (busy.current) return false;

        busy.current = true;
        setProcessingId(id);
        try {
            await operation();
            await refresh();
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            busy.current = false;
            setProcessingId(null);
        }
    }, [handleError, refresh]);

    return { dataSource, loading, processingId, refresh, mutate };
}
