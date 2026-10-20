import { useEffect, useState } from "react";
import { getManagedEmployees } from "../api/ManagedEmployeesApi";

export default function useManagedEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [request, setRequest] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError(false);

        getManagedEmployees()
            .then((response) => {
                if (!cancelled) setEmployees(response.data);
            })
            .catch((err) => {
                if (cancelled) return;
                setEmployees([]);
                setError(true);
                console.error("No fue posible cargar los empleados a cargo.", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [request]);

    return {
        employees,
        loading,
        error,
        retry: () => setRequest((value) => value + 1),
    };
}
