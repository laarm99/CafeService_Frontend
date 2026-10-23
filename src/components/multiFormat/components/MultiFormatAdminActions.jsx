import { useState } from "react";
import { Alert, Flex, Modal, Typography } from "antd";
import { CheckCircleFilled, FilePdfOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import AppButton from "../../common/buttons";
import { getErrorMessage } from "../../../utils/display-errors";
import { notifySuccess } from "../../../utils/messages";
import { complete, downloadPdf } from "../api/MultiFormatApi";

// Acciones exclusivas del Admin: descargar el PDF (aprobado o completado)
// y marcar como completado (solo aprobado por el supervisor).
export default function MultiFormatAdminActions({ record, canComplete, canDownload, onDone }) {
    const { t } = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleComplete = async () => {
        setProcessing(true);
        setError(null);
        try {
            const updated = await complete(record.id);
            notifySuccess(t("multiFormat.messages.completed"));
            setConfirmOpen(false);
            onDone?.(updated?.data ?? updated);
        } catch (err) {
            setConfirmOpen(false);
            setError(getErrorMessage(err));
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = async () => {
        setProcessing(true);
        setError(null);
        try {
            await downloadPdf(record.id);
        } catch (err) {
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
            <Flex gap="small" wrap justify="flex-end">
                {canDownload && (
                    <AppButton
                        title={t("multiFormat.admin.downloadPdf")}
                        icon={<FilePdfOutlined style={{ fontSize: 22 }} />}
                        startColor="#69b1ff"
                        endColor="#0958d9"
                        disabled={processing}
                        onClick={handleDownload}
                    />
                )}
                {canComplete && (
                    <AppButton
                        title={t("multiFormat.admin.complete")}
                        icon={<CheckCircleFilled style={{ fontSize: 22 }} />}
                        startColor="#95de64"
                        endColor="#237804"
                        disabled={processing}
                        onClick={() => setConfirmOpen(true)}
                    />
                )}
            </Flex>

            <Modal
                open={confirmOpen}
                title={t("multiFormat.admin.completeTitle")}
                okText={t("multiFormat.admin.complete")}
                cancelText={t("multiFormat.approval.cancel")}
                confirmLoading={processing}
                onOk={handleComplete}
                onCancel={() => setConfirmOpen(false)}
                destroyOnHidden
            >
                <Typography.Paragraph type="secondary">
                    {t("multiFormat.admin.completeHelp")}
                </Typography.Paragraph>
            </Modal>
        </>
    );
}
