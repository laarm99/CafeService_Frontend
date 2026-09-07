import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { approve, reject } from '../api/MultiFormatApi';
import displayError from '../../../utils/display-errors';
import { notifySuccess } from '../../../utils/messages';

// Acciones del aprobador: Aprobar (comentario opcional) y
// Rechazar (comentario obligatorio).
// El backend registra quien decidio y cuando; aqui solo se envia el comentario.
export default function useMultiFormatApproval() {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);

    const runAction = useCallback(async (action, id, comment, successKey) => {
        setProcessing(true);
        try {
            const response = await action(id, comment);
            notifySuccess(t(successKey));
            return response?.data ?? null;
        } catch (err) {
            displayError(err);
            return null;
        } finally {
            setProcessing(false);
        }
    }, [t]);

    const approveRecord = useCallback(
        (id, comment) => runAction(approve, id, comment, 'multiFormat.messages.approved'),
        [runAction]
    );

    const rejectRecord = useCallback(
        (id, comment) => runAction(reject, id, comment, 'multiFormat.messages.rejected'),
        [runAction]
    );

    return { approveRecord, rejectRecord, processing };
}
