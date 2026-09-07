import { useState } from "react";
import { Alert, Flex, Input, Modal, Typography } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import AppButton from "../../common/buttons";
import useMultiFormatApproval from "../hooks/useMultiFormatApproval";

// Acciones del aprobador sobre un formato en estado "Enviado".
//
// PENDIENTE (roles y permisos): hoy los botones se muestran a cualquier usuario
// porque el aprobador es dummy. Cuando existan roles, este componente debera
// renderizarse solo si el usuario en sesion es el aprobador asignado
// (por ejemplo: if (!user.canApprove(record)) return null).
export default function MultiFormatApprovalActions({ record, onDone }) {
    const { t } = useTranslation();
    const { approveRecord, rejectRecord, processing } = useMultiFormatApproval();

    const [action, setAction] = useState(null); // 'approve' | 'reject'
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);

    const isReject = action === "reject";

    const closeModal = () => {
        setAction(null);
        setComment("");
        setCommentError(null);
    };

    const handleConfirm = async () => {
        // El comentario solo es obligatorio al rechazar
        if (isReject && !comment.trim()) {
            setCommentError(t("multiFormat.approval.commentRequired"));
            return;
        }

        const updated = isReject
            ? await rejectRecord(record.id, comment)
            : await approveRecord(record.id, comment);

        if (updated) {
            closeModal();
            onDone?.(updated);
        }
    };

    return (
        <>
            <Flex gap="small" wrap justify="flex-end">
                <AppButton
                    title={t("multiFormat.approval.reject")}
                    icon={<CloseCircleFilled style={{ fontSize: 22 }} />}
                    startColor="#ff7875"
                    endColor="#a8071a"
                    disabled={processing}
                    onClick={() => setAction("reject")}
                />

                <AppButton
                    title={t("multiFormat.approval.approve")}
                    icon={<CheckCircleFilled style={{ fontSize: 22 }} />}
                    startColor="#95de64"
                    endColor="#237804"
                    disabled={processing}
                    onClick={() => setAction("approve")}
                />
            </Flex>

            <Modal
                open={Boolean(action)}
                title={isReject
                    ? t("multiFormat.approval.rejectTitle")
                    : t("multiFormat.approval.approveTitle")}
                okText={isReject
                    ? t("multiFormat.approval.reject")
                    : t("multiFormat.approval.approve")}
                cancelText={t("multiFormat.approval.cancel")}
                okButtonProps={{ danger: isReject }}
                confirmLoading={processing}
                onOk={handleConfirm}
                onCancel={closeModal}
                destroyOnHidden
            >
                <Typography.Paragraph type="secondary">
                    {isReject
                        ? t("multiFormat.approval.rejectHelp")
                        : t("multiFormat.approval.approveHelp")}
                </Typography.Paragraph>

                <Input.TextArea
                    rows={4}
                    value={comment}
                    maxLength={500}
                    showCount
                    status={commentError ? "error" : undefined}
                    placeholder={isReject
                        ? t("multiFormat.approval.commentPlaceholderRequired")
                        : t("multiFormat.approval.commentPlaceholderOptional")}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (commentError) setCommentError(null);
                    }}
                />

                {commentError && (
                    <Alert
                        type="error"
                        showIcon
                        message={commentError}
                        style={{ marginTop: 12 }}
                    />
                )}
            </Modal>
        </>
    );
}
