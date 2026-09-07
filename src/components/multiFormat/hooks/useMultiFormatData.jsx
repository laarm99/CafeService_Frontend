import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAll, remove as removeRequest } from '../api/MultiFormatApi';
import { toRow } from '../mappers/multiFormat.mapper';
import displayError from '../../../utils/display-errors';
import { notifySuccess } from '../../../utils/messages';

// Reemplaza al hook que devolvia el arreglo hardcodeado.
// Conserva la firma anterior ({ dataSource }) y agrega loading, error,
// refresh y removeRecord.
export default function useMultiFormatData(params) {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Evita setState sobre un componente desmontado (StrictMode / navegacion rapida)
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const paramsKey = JSON.stringify(params ?? {});

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAll(JSON.parse(paramsKey));
            if (!isMounted.current) return;
            const rows = Array.isArray(response?.data)
                ? response.data
                : (response?.data?.items ?? []);
            setDataSource(rows.map(toRow));
        } catch (err) {
            if (!isMounted.current) return;
            setError(err);
            displayError(err);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [paramsKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const removeRecord = useCallback(async (id) => {
        try {
            await removeRequest(id);
            notifySuccess(t('multiFormat.messages.deleted'));
            await fetchData();
            return true;
        } catch (err) {
            displayError(err);
            return false;
        }
    }, [fetchData, t]);

    return {
        dataSource,
        loading,
        error,
        refresh: fetchData,
        removeRecord,
    };
}
