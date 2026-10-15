import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Form, Popconfirm, Row, Skeleton, Tabs, Typography } from "antd";
import {
    FileProtectOutlined,
    FileTextOutlined,
    SendOutlined,
    SunOutlined,
    SwapOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import styles from "../styles/MultiFormatForm.module.css";
import AppButton from "../../common/buttons";
import ChangeDepOrShift from "./ChangeDepOrShifForm";
import VacationsForm from "./VacationForm";
import PermissionForm from "./PermissionForm";
import TimeAdjustmentForm from "./TimeAdjustmentForm";

import { getById, getCurrentEmployee } from "../api/MultiFormatApi";
import { getManagedEmployees } from "../api/ManagedEmployeesApi";
import { toFormValues } from "../mappers/multiFormat.mapper";
import useMultiFormatSubmit from "../hooks/useMultiFormatSubmit";
import displayError from "../../../utils/display-errors";

// La pestaña activa define el tipo de movimiento que se manda al backend.
const MOVEMENT_TYPE_BY_TAB = {
    "1": "CHANGE_DEP_SHIFT",
    "2": "VACATION",
    "3": "PERMISSION",
    "4": "TIME_ADJUSTMENT",
};

// Campos que pertenecen a cada movimiento.
// Solo estos viajan al backend, para que al cambiar de pestaña no se envien
// datos de un movimiento que no es el seleccionado.
// La fecha efectiva pertenece al cambio de departamento y/o turno.
const FIELDS_BY_MOVEMENT = {
    CHANGE_DEP_SHIFT: [
        "employeeId",
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
    TIME_ADJUSTMENT: [
        "adjustmentDate",
        "missingPunchType",
        "entryTime",
        "exitTime",
        "justification",
    ],
};

const DISPLAY_DATE = "DD/MM/YYYY";

export default function MultiFormatForm({ id = null }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [employee, setEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [managedEmployees, setManagedEmployees] = useState([]);
    const [managedEmployeesLoading, setManagedEmployeesLoading] = useState(false);
    const [managedEmployeesError, setManagedEmployeesError] = useState(false);
    const [managedEmployeesRequest, setManagedEmployeesRequest] = useState(0);
    const [pendingEmployeeId, setPendingEmployeeId] = useState(null);
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
                    if (tab) {
                        setActiveTab(tab);
                        if (values.movementType === "CHANGE_DEP_SHIFT") {
                            setPendingEmployeeId(values.employeeId);
                        }
                    }
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

    // La lista la limita el backend a las personas a cargo del usuario autenticado.
    useEffect(() => {
        let cancelled = false;

        async function loadManagedEmployees() {
            setManagedEmployeesLoading(true);
            setManagedEmployeesError(false);
            try {
                const response = await getManagedEmployees();
                if (!cancelled) setManagedEmployees(response.data);
            } catch (err) {
                if (!cancelled) {
                    setManagedEmployees([]);
                    setManagedEmployeesError(true);
                    console.error("No fue posible cargar los empleados a cargo.", err);
                }
            } finally {
                if (!cancelled) setManagedEmployeesLoading(false);
            }
        }

        loadManagedEmployees();
        return () => {
            cancelled = true;
        };
    }, [managedEmployeesRequest]);

    useEffect(() => {
        if (pendingEmployeeId === null || pendingEmployeeId === undefined) return;

        const recordEmployee = managedEmployees.find(
            (managedEmployee) => String(managedEmployee.id) === String(pendingEmployeeId)
        );
        if (recordEmployee) {
            setSelectedEmployee(recordEmployee);
            form.setFieldsValue({ employeeId: recordEmployee.id });
        } else if (!managedEmployeesLoading && !managedEmployeesError) {
            setSelectedEmployee(null);
            form.setFieldsValue({ employeeId: undefined });
        }
    }, [
        form,
        managedEmployees,
        managedEmployeesError,
        managedEmployeesLoading,
        pendingEmployeeId,
    ]);

    const handleEmployeeChange = (nextEmployee) => {
        setSelectedEmployee(nextEmployee);
        setPendingEmployeeId(null);
        form.setFieldsValue({
            employeeId: nextEmployee?.id,
            effectiveDate: undefined,
            newPlant: undefined,
            newShift: undefined,
            newDepartment: undefined,
            newSupervisor: undefined,
            newArea: undefined,
        });
        form.setFields([
            "employeeId",
            "effectiveDate",
            "newPlant",
            "newShift",
            "newDepartment",
            "newSupervisor",
            "newArea",
        ].map((name) => ({ name, errors: [], touched: false })));
    };

    const handleFinish = (values) => {
        if (!employee) {
            displayError(new Error("No se pudieron cargar los datos del empleado."));
            return;
        }

        const movementType = MOVEMENT_TYPE_BY_TAB[activeTab];
        if (
            movementType === "CHANGE_DEP_SHIFT"
            && (
                !selectedEmployee
                || String(selectedEmployee.id) !== String(values.employeeId)
                || !managedEmployees.some(
                    (managedEmployee) => String(managedEmployee.id) === String(values.employeeId)
                )
            )
        ) {
            form.setFields([{
                name: "employeeId",
                errors: [t("multiFormat.change.employees.required")],
            }]);
            return;
        }

        // Solo se envian los campos del movimiento seleccionado
        const movementValues = (FIELDS_BY_MOVEMENT[movementType] ?? []).reduce((acc, field) => {
            if (values[field] !== undefined) acc[field] = values[field];
            return acc;
        }, {});

        submit({
            ...movementValues,
            movementType,
            clockNumber: movementType === "CHANGE_DEP_SHIFT"
                ? selectedEmployee?.employeeNumber
                : employee.employeeNumber,
            fullName: movementType === "CHANGE_DEP_SHIFT"
                ? selectedEmployee?.fullName
                : employee.fullName,
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
                    disabled={!employee}
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
                                        {employee?.currentDate
                                            ? dayjs(employee.currentDate).format(DISPLAY_DATE)
                                            : "-"}
                                    </Typography.Text>
                                </Col>
                            </Row>

                            <br />

                            <Row gutter={16}>
                                <Col xs={24} md={3}>
                                    <Form.Item label={t("multiFormat.employee.clockNumber")}>
                                        <Typography.Text>{employee?.employeeNumber ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={7}>
                                    <Form.Item label={t("multiFormat.employee.fullName")}>
                                        <Typography.Text>{employee?.fullName ?? "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={5}>
                                    <Form.Item label={t("multiFormat.employee.position")}>
                                        <Typography.Text>{employee?.position || "-"}</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={5}>
                                    <Form.Item label={t("multiFormat.employee.department")}>
                                        <Typography.Text>{employee?.department ?? "-"}</Typography.Text>
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
                                    children: (
                                        <ChangeDepOrShift
                                            employee={selectedEmployee}
                                            employees={managedEmployees}
                                            employeesLoading={managedEmployeesLoading}
                                            employeesError={managedEmployeesError}
                                            onRetryEmployees={() => setManagedEmployeesRequest((value) => value + 1)}
                                            onEmployeeChange={handleEmployeeChange}
                                        />
                                    ),
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
                                {
                                    key: "4",
                                    label: t("multiFormat.movement.TIME_ADJUSTMENT"),
                                    children: <TimeAdjustmentForm />,
                                    icon: <ClockCircleOutlined />,
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
                            disabled={submitting || !employee}
                        />
                    </Popconfirm>
                </div>
            </Skeleton>
        </Card>
    );
}
