import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Card, Col, Descriptions, Empty, Row, Skeleton, Tag, Typography } from "antd";
import {
    FileProtectOutlined,
    FileSearchOutlined,
    SunOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import styles from "../styles/MultiFormatForm.module.css";
import { getById } from "../api/MultiFormatApi";
import MultiFormatApprovalActions from "./MultiFormatApprovalActions";
import displayError from "../../../utils/display-errors";

const DISPLAY_DATE = "DD/MM/YYYY";

const STATUS_COLORS = {
    SUBMITTED: "blue",
    APPROVED: "green",
    REJECTED: "red",
    IN_REVIEW: "blue",
    PENDING: "orange",
};

const MOVEMENT_ICONS = {
    CHANGE_DEP_SHIFT: <SwapOutlined />,
    VACATION: <SunOutlined />,
    PERMISSION: <FileProtectOutlined />,
};

// Vista informativa (solo lectura) del formato.
// Mantiene la estructura de tarjetas del alta, pero sin campos editables,
// y es donde el aprobador atiende el formato.
// El retorno vive en la barra superior, junto al breadcrumb.
export default function MultiFormatDetail({ id: idProp = null }) {
    const { t } = useTranslation();
    const params = useParams();
    const id = idProp ?? params.multiFormatId;

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const response = await getById(id);
                if (!cancelled) setRecord(response.data);
            } catch (err) {
                if (!cancelled) displayError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const value = (v) => (v === undefined || v === null || v === "" ? "-" : v);
    const dateValue = (v) => (v ? dayjs(v).format(DISPLAY_DATE) : "-");

    const isSubmitted = record?.status === "SUBMITTED";
    const hasDecision = record?.status === "APPROVED" || record?.status === "REJECTED";

    // Bloque de datos que depende del tipo de movimiento
    const renderMovementDetail = () => {
        if (!record?.movementType) return <Empty description={t("multiFormat.detail.noData")} />;

        if (record.movementType === "CHANGE_DEP_SHIFT") {
            const rows = [
                { label: t("multiFormat.change.plant"), field: "newPlant" },
                { label: t("multiFormat.change.shift"), field: "newShift" },
                { label: t("multiFormat.change.department"), field: "newDepartment" },
                { label: t("multiFormat.change.supervisor"), field: "newSupervisor" },
                { label: t("multiFormat.change.area"), field: "newArea" },
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
                <Descriptions.Item label={t("multiFormat.permission.document.label")} span={2}>
                    {record.attachments?.length
                        ? record.attachments.map((file) => file.name).join(", ")
                        : "-"}
                </Descriptions.Item>
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
                        {isSubmitted && (
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
                                <Descriptions.Item label={t("multiFormat.grid.approver")}>
                                    {value(record.approver?.name)}
                                    {record.approver?.position
                                        ? ` — ${record.approver.position}`
                                        : ""}
                                </Descriptions.Item>

                                {hasDecision && (
                                    <>
                                        <Descriptions.Item label={t("multiFormat.approval.decisionBy")}>
                                            {value(record.decisionBy)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("multiFormat.approval.decisionAt")}>
                                            {dateValue(record.decisionAt)}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={t("multiFormat.approval.comment")}
                                            span={2}
                                        >
                                            {value(record.decisionComment)}
                                        </Descriptions.Item>
                                    </>
                                )}
                            </Descriptions>

                            {/* Acciones del aprobador: solo mientras esta Enviado.
                                Cuando existan roles, ademas se validara el permiso. */}
                            {isSubmitted && (
                                <div style={{ marginTop: 18 }}>
                                    <MultiFormatApprovalActions
                                        record={record}
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
