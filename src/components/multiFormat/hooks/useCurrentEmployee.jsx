import { useEffect, useState } from "react";
import { getCurrentEmployee } from "../api/MultiFormatApi";
import displayError from "../../../utils/display-errors";

export default function useCurrentEmployee() {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        getCurrentEmployee()
            .then((response) => {
                if (!cancelled) setEmployee(response.data);
            })
            .catch((err) => {
                if (!cancelled) displayError(err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { employee, loading };
}
