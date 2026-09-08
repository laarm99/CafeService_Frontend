import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Form, Popconfirm, Row, Skeleton, Tabs, Typography } from "antd";
import {
    FileProtectOutlined,
    FileTextOutlined,
    SendOutlined,
    SunOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import styles from "../styles/MultiFormatForm.module.css";
import AppButton from "../../common/buttons";
import ChangeDepOrShift from "./ChangeDepOrShifForm";
import VacationsForm from "./VacationForm";
import PermissionForm from "./PermissionForm";

import { getById, getCurrentEmployee } from "../api/MultiFormatApi";
import { toFormValues } from "../mappers/multiFormat.mapper";
import useMultiFormatSubmit from "../hooks/useMultiFormatSubmit";
import displayError from "../../../utils/display-errors";

// La pestaña activa define el tipo de movimiento que se manda al backend.
const MOVEMENT_TYPE_BY_TAB = {
    "1": "CHANGE_DEP_SHIFT",
    "2": "VACATION",
    "3": "PERMISSION",
};

// Campos que pertenecen a cada movimiento.
// Solo estos viajan al backend, para que al cambiar de pestaña no se envien
// datos de un movimiento que no es el seleccionado.
// La fecha efectiva pertenece al cambio de departamento y/o turno.
const FIELDS_BY_MOVEMENT = {
    CHANGE_DEP_SHIFT: [
        "effectiveDate",
        "newPlant",
        "newShift",
        "newDepartment",
        "newSupervisor",
        "newArea",
    ],
    VACATION: [
        "vacationDays",
        "vacationStartDate",
        "vacationEndDate",
        "vacationReturnDate",
    ],
    PERMISSION: [
        "permissionType",
        "permissionDays",
        "permissionStartDate",
        "permissionEndDate",
        "permissionReturnDate",
        "swapDetail",
        "attachments",
    ],
};

const DISPLAY_DATE = "DD/MM/YYYY";

export default function MultiFormatForm({ id = null }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");

    const { submit, submitting, isEdit } = useMultiFormatSubmit({
        form,
        id,
        // Al enviar, se redirige al detalle del formato recien creado
        redirectTo: (record) => (record?.id ? `/multiFormat/${record.id}` : "/multiFormat"),
    });

    // Carga los datos del empleado y, en modo edicion, el formato existente.
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const employeeResponse = await getCurrentEmployee();
                if (cancelled) return;
                setEmployee(employeeResponse.data);

                if (id) {
                    const recordResponse = await getById(id);
                    if (cancelled) return;
                    const record = recordResponse.data;

                    // Un formato ya enviado no puede modificarse: se manda al detalle
                    if (record?.status) {
                        navigate(`/multiFormat/${id}`, { replace: true });
                        return;
                    }

                    const values = toFormValues(record);
                    form.setFieldsValue(values);

                    const tab = Object.keys(MOVEMENT_TYPE_BY_TAB).find(
                        (key) => MOVEMENT_TYPE_BY_TAB[key] === values.movementType
                    );
                    if (tab) setActiveTab(tab);
                }
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
    }, [id, form, navigate]);

    const handleFinish = (values) => {
        const movementType = MOVEMENT_TYPE_BY_TAB[activeTab];

        // Solo se envian los campos del movimiento seleccionado
        const movementValues = (FIELDS_BY_MOVEMENT[movementType] ?? []).reduce((acc, field) => {
            if (values[field] !== undefined) acc[field] = values[field];
            return acc;
        }, {});

        submit({
            ...movementValues,
            movementType,
            clockNumber: employee?.clockNumber,
            netkey: employee?.netkey,
            fullName: employee?.fullName,
        });
    };

    return (
        <Card
            title={
                <div className={styles.cardHeader}>
                    <div>
                        <h2>
                            <FileTextOutlined className={styles.headerIcon} />
                            {isEdit ? t("multiFormat.title.edit") : t("multiFormat.title.create")}
                        </h2>
                    </div>
                </div>
            }
            className={styles.modernCard}
        >
            <Skeleton active loading={loading} paragraph={{ rows: 6 }}>
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                    onFinish={handleFinish}
                    initialValues={{ permissionType: 1 }}
                >
                    <Card
                        className={styles.modernCardEmployeData}
                        title={t("multiFormat.employee.section")}
                    >
                        <div className={styles.cardHeader}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Typography.Text strong>
                                        {t("multiFormat.employee.currentDate")}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
                                        {dayjs().format(DISPLAY_DATE)}
                                    </Typography.Text>
                                </Col>
                            </Row>

                            <br />

                            <Row gutter={16}>
                                <Col xs={24} md={3}>
                                    <Form.Item label={t("multiFormat.employee.clockNumber")}>
                                        <Typography.Text>{employee?.clockNumber ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={7}>
                                    <Form.Item label={t("multiFormat.employee.fullName")}>
                                        <Typography.Text>{employee?.fullName ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={5}>
                                    <Form.Item label={t("multiFormat.employee.position")}>
                                        <Typography.Text>{employee?.position ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={5}>
                                    <Form.Item label={t("multiFormat.employee.department")}>
                                        <Typography.Text>{employee?.department ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item label={t("multiFormat.employee.hireDate")}>
                                        <Typography.Text>
                                            {employee?.hireDate
                                                ? dayjs(employee.hireDate).format(DISPLAY_DATE)
                                                : "-"}
                                        </Typography.Text>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Card>

                    <br />

                    <Card
                        className={styles.modernCardEmployeData}
                        title={t("multiFormat.movement.section")}
                    >
                        {/* destroyOnHidden: la pestaña inactiva se desmonta, asi sus
                            campos requeridos no bloquean el envio de otro movimiento. */}
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            destroyOnHidden
                            items={[
                                {
                                    key: "1",
                                    label: t("multiFormat.movement.CHANGE_DEP_SHIFT"),
                                    children: <ChangeDepOrShift employee={employee} />,
                                    icon: <SwapOutlined />,
                                },
                                {
                                    key: "2",
                                    label: t("multiFormat.movement.VACATION"),
                                    children: <VacationsForm />,
                                    icon: <SunOutlined />,
                                },
                                {
                                    key: "3",
                                    label: t("multiFormat.movement.PERMISSION"),
                                    children: <PermissionForm />,
                                    icon: <FileProtectOutlined />,
                                },
                            ]}
                        />
                    </Card>
                </Form>

                {/* Enviar al aprobador. Mientras no se confirme, el usuario
                    puede seguir modificando el formato. */}
                <div className={styles["divButton"]}>
                    <Popconfirm
                        title={t("multiFormat.send.confirmTitle")}
                        description={t("multiFormat.send.confirmDescription")}
                        okText={t("multiFormat.send.confirmOk")}
                        cancelText={t("multiFormat.send.confirmCancel")}
                        placement="topRight"
                        onConfirm={() => form.submit()}
                    >
                        <AppButton
                            title={t("multiFormat.send.action")}
                            icon={<SendOutlined style={{ fontSize: 22 }} />}
                            startColor="#fb8421"
                            endColor="#162852"
                            loading={submitting}
                            disabled={submitting}
                        />
                    </Popconfirm>
                </div>
            </Skeleton>
        </Card>
    );
}
