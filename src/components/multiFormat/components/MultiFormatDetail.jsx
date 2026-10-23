import { useContext, useState } from "react";
import { AuthContext } from "../../../pages/login/AuthProvider";
import { useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Descriptions, Empty, Flex, Row, Skeleton, Tag, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadAttachment } from "../api/MultiFormatApi";
import { getErrorMessage } from "../../../utils/display-errors";
import {
    FileProtectOutlined,
    FileSearchOutlined,
    SunOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import styles from "../styles/MultiFormatForm.module.css";
import MultiFormatApprovalActions from "./MultiFormatApprovalActions";
import MultiFormatAdminActions from "./MultiFormatAdminActions";
import MultiFormatCancelAction from "./MultiFormatCancelAction";
import useMultiFormatRecord from "../hooks/useMultiFormatRecord";
import usePermissions from "../../../pages/login/usePermissions";

const DISPLAY_DATE = "DD/MM/YYYY";

const STATUS_COLORS = {
    SUBMITTED: "blue",
    APPROVED: "green",
    COMPLETED: "cyan",
    REJECTED: "red",
    CANCELLED: "default",
    IN_REVIEW: "blue",
    PENDING: "orange",
};

const MOVEMENT_ICONS = {
    CHANGE_DEP_SHIFT: <SwapOutlined />,
    VACATION: <SunOutlined />,
    PERMISSION: <FileProtectOutlined />,
    TIME_ADJUSTMENT: <SwapOutlined />,
};

// Vista informativa (solo lectura) del formato.
// Mantiene la estructura de tarjetas del alta, pero sin campos editables,
// y es donde el aprobador atiende el formato.
// El retorno vive en la barra superior, junto al breadcrumb.
export default function MultiFormatDetail({ id: idProp = null }) {
    const { t } = useTranslation();
    const params = useParams();
    const id = idProp ?? params.multiFormatId;

    const { record, loading, setRecord } = useMultiFormatRecord(id);
    const permissions = usePermissions();
    const [downloadingId, setDownloadingId] = useState(null);
    const [attachmentError, setAttachmentError] = useState(null);

    const handleDownloadAttachment = async (file) => {
        setDownloadingId(file.id);
        setAttachmentError(null);
        try {
            await downloadAttachment(record.id, file);
        } catch (err) {
            setAttachmentError(getErrorMessage(err));
        } finally {
            setDownloadingId(null);
        }
    };
    const value = (v) => (v === undefined || v === null || v === "" ? "-" : v);
    const dateValue = (v) => (v ? dayjs(v).format(DISPLAY_DATE) : "-");

    const { auth } = useContext(AuthContext);
    const toUserName = (name) => String(name ?? "").split("\\").pop().trim().toUpperCase();
    // Solicitud propia: no se aprueba a sí mismo y no se muestran "mis" datos como aprobador.
    const isOwnRecord = Boolean(record)
        && toUserName(record.netkey) === toUserName(auth?.user?.domainUserName);

    const isSubmitted = record?.status === "SUBMITTED";
    // Aprobar/Rechazar: solo Supervisor y formato Enviado (el cambio de depto/turno esta deshabilitado).
    // El backend valida ademas que sea su empleado y que no sea su propia solicitud.
    const canDecide = permissions.canApproveRequests
        && isSubmitted
        && !isOwnRecord
        && record?.movementType !== "CHANGE_DEP_SHIFT";
    const canCompleteAction = permissions.canCompleteRequests && record?.status === "APPROVED";
    const canDownloadAction = permissions.canDownloadPdf
        && (record?.status === "APPROVED" || record?.status === "COMPLETED");
    // Bloque de datos que depende del tipo de movimiento
    const renderMovementDetail = () => {
        if (!record?.movementType) return <Empty description={t("multiFormat.detail.noData")} />;

        if (record.movementType === "CHANGE_DEP_SHIFT") {
            const rows = [
                { label: t("multiFormat.change.plant"), field: "newPlant" },
                { label: t("multiFormat.change.shift"), field: "newShift" },
                { label: t("multiFormat.change.department"), field: "newDepartment" },
                { label: t("multiFormat.change.supervisor"), field: "newSupervisor" },
            ];

            return (
                <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                    {/* La fecha efectiva pertenece a este movimiento */}
                    <Descriptions.Item label={t("multiFormat.effectiveDate.label")} span={2}>
                        {dateValue(record.effectiveDate)}
                    </Descriptions.Item>

                    {rows.map((row) => (
                        <Descriptions.Item label={row.label} key={row.field}>
                            {value(record[row.field])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            );
        }

        if (record.movementType === "VACATION") {
            return (
                <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                    <Descriptions.Item label={t("multiFormat.vacation.days")}>
                        {value(record.vacationDays)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.vacation.startDate")}>
                        {dateValue(record.vacationStartDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.vacation.endDate")}>
                        {dateValue(record.vacationEndDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.vacation.returnDate")}>
                        {dateValue(record.vacationReturnDate)}
                    </Descriptions.Item>
                </Descriptions>
            );
        }

        const permissionLabels = {
            1: t("multiFormat.permission.marriage"),
            2: t("multiFormat.permission.birth"),
            3: t("multiFormat.permission.death"),
            4: t("multiFormat.permission.unpaid"),
            5: t("multiFormat.permission.swap"),
        };

        if (record.movementType === "PERMISSION") {
            return (
                <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                    <Descriptions.Item label={t("multiFormat.detail.permissionType")}>
                        {value(permissionLabels[record.permissionType])}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.permission.days")}>
                        {value(record.permissionDays)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.permission.startDate")}>
                        {dateValue(record.permissionStartDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.permission.endDate")}>
                        {dateValue(record.permissionEndDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.permission.returnDate")}>
                        {dateValue(record.permissionReturnDate)}
                    </Descriptions.Item>
                    {record.permissionType === 5 && (
                        <Descriptions.Item label={t("multiFormat.permission.swapDetail.label")} span={2}>
                            {value(record.swapDetail)}
                        </Descriptions.Item>
                    )}
                    {Array.isArray(record.attachments) && record.attachments.length > 0 && (
                        <Descriptions.Item label={t("multiFormat.permission.attachment")} span={2}>
                            <Flex vertical gap={6} align="flex-start">
                                {record.attachments.map((file) => (
                                    <Button
                                        key={file.id}
                                        type="link"
                                        icon={<DownloadOutlined />}
                                        style={{ padding: 0 }}
                                        loading={downloadingId === file.id}
                                        onClick={() => handleDownloadAttachment(file)}
                                    >
                                        {file.name || t("multiFormat.permission.downloadFile")}
                                    </Button>
                                ))}
                                {attachmentError && (
                                    <Alert
                                        type="error"
                                        showIcon
                                        closable
                                        message={attachmentError}
                                        onClose={() => setAttachmentError(null)}
                                    />
                                )}
                            </Flex>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            );
        }

        if (record.movementType === "TIME_ADJUSTMENT") {
            const adjustmentTypeLabels = {
                1: t("multiFormat.timeAdjustment.entry"),
                2: t("multiFormat.timeAdjustment.exit"),
                3: t("multiFormat.timeAdjustment.both"),
                ENTRY: t("multiFormat.timeAdjustment.entry"),
                EXIT: t("multiFormat.timeAdjustment.exit"),
                BOTH: t("multiFormat.timeAdjustment.both"),
            };
            const punchType = record.missingPunchType ?? record.adjustmentType;
            const entryTime = record.entryTime ?? (record.adjustmentType === "ENTRY" ? record.adjustmentTime : null);
            const exitTime = record.exitTime ?? (record.adjustmentType === "EXIT" ? record.adjustmentTime : null);
            const justification = record.justification ?? record.adjustmentComment;

            return (
                <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                    <Descriptions.Item label={t("multiFormat.timeAdjustment.date")}>
                        {dateValue(record.adjustmentDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("multiFormat.timeAdjustment.type")}>
                        {value(adjustmentTypeLabels[punchType])}
                    </Descriptions.Item>
                    {entryTime && (
                        <Descriptions.Item label={t("multiFormat.timeAdjustment.entryTime")}>
                            {value(entryTime)}
                        </Descriptions.Item>
                    )}
                    {exitTime && (
                        <Descriptions.Item label={t("multiFormat.timeAdjustment.exitTime")}>
                            {value(exitTime)}
                        </Descriptions.Item>
                    )}
                    {justification && (
                        <Descriptions.Item label={t("multiFormat.timeAdjustment.justification")} span={2}>
                            {value(justification)}
                        </Descriptions.Item>
                    )}
                </Descriptions>
            );
        }

        return (
            <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                <Descriptions.Item label={t("multiFormat.detail.permissionType")}>
                    {value(permissionLabels[record.permissionType])}
                </Descriptions.Item>
                <Descriptions.Item label={t("multiFormat.permission.days")}>
                    {value(record.permissionDays)}
                </Descriptions.Item>
                <Descriptions.Item label={t("multiFormat.permission.startDate")}>
                    {dateValue(record.permissionStartDate)}
                </Descriptions.Item>
                <Descriptions.Item label={t("multiFormat.permission.endDate")}>
                    {dateValue(record.permissionEndDate)}
                </Descriptions.Item>
                <Descriptions.Item label={t("multiFormat.permission.returnDate")}>
                    {dateValue(record.permissionReturnDate)}
                </Descriptions.Item>
                {record.permissionType === 5 && (
                    <Descriptions.Item label={t("multiFormat.permission.swapDetail.label")} span={2}>
                        {value(record.swapDetail)}
                    </Descriptions.Item>
                )}
            </Descriptions>
        );
    };

    return (
        <Card
            title={
                <div className={styles.cardHeader}>
                    <div>
                        <h2>
                            <FileSearchOutlined className={styles.headerIcon} />
                            {t("multiFormat.title.detail")}
                        </h2>
                    </div>
                </div>
            }
            className={styles.modernCard}
        >
            <Skeleton active loading={loading} paragraph={{ rows: 6 }}>
                {!record ? (
                    <Empty description={t("multiFormat.detail.notFound")} />
                ) : (
                    <>
                        {/* Aviso de solo lectura: enviado ya no se puede modificar */}
                        {isSubmitted && isOwnRecord && (
                            <Alert
                                type="info"
                                showIcon
                                message={t("multiFormat.detail.lockedTitle")}
                                description={t("multiFormat.detail.lockedDescription", {
                                    approver: record.approver?.name ?? "-",
                                })}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Card
                            className={styles.modernCardEmployeData}
                            title={t("multiFormat.detail.generalSection")}
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={4}>
                                    <Typography.Text type="secondary">
                                        {t("multiFormat.detail.folio")}
                                    </Typography.Text>
                                    <div>
                                        <Typography.Text strong>#{value(record.id)}</Typography.Text>
                                    </div>
                                </Col>

                                <Col xs={24} md={5}>
                                    <Typography.Text type="secondary">
                                        {t("multiFormat.grid.createdAt")}
                                    </Typography.Text>
                                    <div>
                                        <Typography.Text strong>
                                            {dateValue(record.createdAt)}
                                        </Typography.Text>
                                    </div>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Typography.Text type="secondary">
                                        {t("multiFormat.grid.type")}
                                    </Typography.Text>
                                    <div>
                                        <Typography.Text strong>
                                            {record.movementType
                                                ? t(`multiFormat.movement.${record.movementType}`)
                                                : "-"}
                                        </Typography.Text>
                                    </div>
                                </Col>

                                {isOwnRecord && (
                                <Col xs={24} md={5}>
                                    <Typography.Text type="secondary">
                                        {t("multiFormat.grid.approver")}
                                    </Typography.Text>
                                    <div>
                                        <Typography.Text strong>
                                            {value(record.approver?.name)}
                                        </Typography.Text>
                                    </div>
                                </Col>
                                )}

                                <Col xs={24} md={4}>
                                    <Typography.Text type="secondary">
                                        {t("multiFormat.grid.status")}
                                    </Typography.Text>
                                    <div>
                                        {record.status ? (
                                            <Tag color={STATUS_COLORS[record.status] ?? "orange"}>
                                                {t(`multiFormat.status.${record.status}`).toUpperCase()}
                                            </Tag>
                                        ) : "-"}
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <br />

                        <Card
                            className={styles.modernCardEmployeData}
                            title={t("multiFormat.employee.section")}
                        >
                            <Descriptions column={{ xs: 1, md: 3 }} bordered size="small">
                                <Descriptions.Item label={t("multiFormat.employee.clockNumber")}>
                                    {value(record.clockNumber)}
                                </Descriptions.Item>
                                <Descriptions.Item label={t("multiFormat.employee.fullName")}>
                                    {value(record.fullName)}
                                </Descriptions.Item>
                                <Descriptions.Item label={t("multiFormat.grid.netkey")}>
                                    {value(record.netkey)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <br />

                        <Card
                            className={styles.modernCardEmployeData}
                            title={
                                <span>
                                    {MOVEMENT_ICONS[record.movementType]}{" "}
                                    {t("multiFormat.detail.movementSection")}
                                </span>
                            }
                        >
                            {renderMovementDetail()}
                        </Card>

                        <br />

                        {/* Seguimiento de la aprobacion */}
                        <Card
                            className={styles.modernCardEmployeData}
                            title={t("multiFormat.approval.section")}
                        >
                            <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                                <Descriptions.Item label={t("multiFormat.approval.sentAt")}>
                                    {dateValue(record.submittedAt)}
                                </Descriptions.Item>
                                {isOwnRecord && (
                                <Descriptions.Item label={t("multiFormat.grid.approver")}>
                                    {value(record.approver?.name)}
                                    {record.approver?.position
                                        ? ` — ${record.approver.position}`
                                        : ""}
                                </Descriptions.Item>
                                )}

                                {record.decisionAt && (
                                    <>
                                        <Descriptions.Item label={t("multiFormat.approval.decidedAt")}>
                                            {dateValue(record.decisionAt)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("multiFormat.approval.decidedBy")}>
                                            {value(record.decisionBy)}
                                        </Descriptions.Item>
                                    </>
                                )}

                                {record.decisionComment && (
                                    <Descriptions.Item label={t("multiFormat.approval.comment")} span={2}>
                                        {value(record.decisionComment)}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            {/* Acciones del aprobador: solo mientras esta Enviado.
                                Cuando existan roles, ademas se validara el permiso. */}
                            {canDecide && (
                                <div style={{ marginTop: 18 }}>
                                    <MultiFormatApprovalActions
                                        record={record}
                                        onDone={(updated) => setRecord(updated)}
                                    />
                                </div>
                            )}

                            {isSubmitted && isOwnRecord && (
                                <div style={{ marginTop: 18 }}>
                                    <MultiFormatCancelAction
                                        record={record}
                                        onDone={(updated) => setRecord(updated)}
                                    />
                                </div>
                            )}

                            {(canCompleteAction || canDownloadAction) && (
                                <div style={{ marginTop: 18 }}>
                                    <MultiFormatAdminActions
                                        record={record}
                                        canComplete={canCompleteAction}
                                        canDownload={canDownloadAction}
                                        onDone={(updated) => setRecord(updated)}
                                    />
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </Skeleton>
        </Card>
    );
}
