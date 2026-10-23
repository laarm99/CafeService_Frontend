import { useState } from "react";
import { Alert, Flex, Modal, Typography } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import AppButton from "../../common/buttons";
import { getErrorMessage } from "../../../utils/display-errors";
import { notifySuccess } from "../../../utils/messages";
import { cancel } from "../api/MultiFormatApi";

// El creador puede cancelar su solicitud mientras siga en estado Enviado.
export default function MultiFormatCancelAction({ record, onDone }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleCancel = async () => {
        setProcessing(true);
        setError(null);
        try {
            const updated = await cancel(record.id);
            notifySuccess(t("multiFormat.messages.cancelled"));
            setOpen(false);
            onDone?.(updated?.data ?? updated);
        } catch (err) {
            setOpen(false);
            setError(getErrorMessage(err));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {error && (
                <Alert
                    type="error"
                    showIcon
                    closable
                    message={error}
                    onClose={() => setError(null)}
                    style={{ marginBottom: 12 }}
                />
            )}
            <Flex justify="flex-end">
                <AppButton
                    title={t("multiFormat.cancel.button")}
                    icon={<CloseCircleFilled style={{ fontSize: 22 }} />}
                    startColor="#ff9c6e"
                    endColor="#d4380d"
                    disabled={processing}
                    onClick={() => setOpen(true)}
                />
            </Flex>

            <Modal
                open={open}
                title={t("multiFormat.cancel.title")}
                okText={t("multiFormat.cancel.button")}
                okButtonProps={{ danger: true }}
                cancelText={t("multiFormat.cancel.keep")}
                confirmLoading={processing}
                onOk={handleCancel}
                onCancel={() => setOpen(false)}
                destroyOnHidden
            >
                <Typography.Paragraph type="secondary">
                    {t("multiFormat.cancel.help")}
                </Typography.Paragraph>
            </Modal>
        </>
    );
}
