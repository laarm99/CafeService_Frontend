import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { create, update } from '../api/MultiFormatApi';
import { toPayload } from '../mappers/multiFormat.mapper';
import displayError from '../../../utils/display-errors';
import { notifySuccess } from '../../../utils/messages';
import { formatErrorsToFormFields } from '../../../utils/response-utils';

// Conecta el Form de Ant Design con el envio del formato.
// Al enviar, el formato queda en estado "Enviado" y se redirige a su detalle.
// redirectTo puede ser una cadena o una funcion (record) => ruta.
export default function useMultiFormatSubmit({ form, id = null, redirectTo = null } = {}) {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isEdit = Boolean(id);

    const submit = useCallback(async (values) => {
        setSubmitting(true);
        try {
            const payload = toPayload(values);
            const response = isEdit ? await update(id, payload) : await create(payload);
            const record = response?.data ?? null;

            // Mensaje de confirmacion indicando el aprobador asignado
            if (!isEdit && record?.approver?.name) {
                notifySuccess(t('multiFormat.messages.sentTo', { approver: record.approver.name }));
            } else {
                notifySuccess(isEdit
                    ? t('multiFormat.messages.updated')
                    : t('multiFormat.messages.created'));
            }

            const target = typeof redirectTo === 'function' ? redirectTo(record) : redirectTo;
            if (target) navigate(target, { replace: true });

            return record;
        } catch (err) {
            // fieldErrors lo agrega el interceptor de backend-requests;
            // el fallback cubre el modo mock y llamadas directas.
            const fieldErrors = err?.fieldErrors?.length
                ? err.fieldErrors
                : formatErrorsToFormFields(err?.response?.data?.errors);

            if (form && fieldErrors?.length) {
                form.setFields(fieldErrors);
            }

            displayError(err);
            return null;
        } finally {
            setSubmitting(false);
        }
    }, [form, id, isEdit, navigate, redirectTo, t]);

    return { submit, submitting, isEdit };
}
