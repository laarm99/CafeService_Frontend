import { useEffect, useState } from "react";
import { getById } from "../api/MultiFormatApi";
import displayError from "../../../utils/display-errors";

export default function useMultiFormatRecord(id) {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(Boolean(id));

    useEffect(() => {
        let cancelled = false;

        if (!id) {
            setRecord(null);
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        setRecord(null);
        setLoading(true);
        getById(id)
            .then((response) => {
                if (!cancelled) setRecord(response.data);
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
    }, [id]);

    return { record, loading, setRecord };
}
