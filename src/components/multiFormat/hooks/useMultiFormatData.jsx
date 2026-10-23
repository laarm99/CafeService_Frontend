import { useCallback, useEffect, useRef, useState } from 'react';
import { getAll } from '../api/MultiFormatApi';
import { toRow } from '../mappers/multiFormat.mapper';
import displayError from '../../../utils/display-errors';

// Devuelve el listado paginado con loading, error y refresh.
export default function useMultiFormatData(params) {
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalCount: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Evita setState sobre un componente desmontado (StrictMode / navegacion rapida)
    const isMounted = useRef(true);
    // Solo la respuesta de la ultima consulta actualiza la tabla
    const latestRequest = useRef(0);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const paramsKey = JSON.stringify(params ?? {});

    const fetchData = useCallback(() => {
        const requestId = ++latestRequest.current;
        const isCurrent = () => isMounted.current && requestId === latestRequest.current;

        setLoading(true);
        setError(null);
        return getAll(JSON.parse(paramsKey))
            .then((response) => {
                if (!isCurrent()) return;
                const { items, page, pageSize, totalCount } = response.data;
                setDataSource(items.map(toRow));
                setPagination({
                    page: page ?? 1,
                    pageSize: pageSize ?? items.length,
                    totalCount: totalCount ?? items.length,
                });
            })
            .catch((err) => {
                if (!isCurrent()) return;
                setError(err);
                setDataSource([]);
                displayError(err);
            })
            .finally(() => {
                if (isCurrent()) setLoading(false);
            });
    }, [paramsKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return {
        dataSource,
        pagination,
        loading,
        error,
        refresh: fetchData,
    };
}
