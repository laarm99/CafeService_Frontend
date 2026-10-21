import { useEffect, useLayoutEffect, useState } from "react";
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

import { toFormValues } from "../mappers/multiFormat.mapper";
import useCurrentEmployee from "../hooks/useCurrentEmployee";
import useManagedEmployees from "../hooks/useManagedEmployees";
import useMultiFormatRecord from "../hooks/useMultiFormatRecord";
import useMultiFormatSubmit from "../hooks/useMultiFormatSubmit";
import displayError from "../../../utils/display-errors";
import usePermissions from "../../../pages/login/usePermissions";

// La pestaña activa define el tipo de movimiento que se manda al backend.
// Permiso necesario para ver cada pestaña (utils/permissions.js)
const PERMISSION_BY_TAB = {
    "1": "canViewDepartmentShiftChange",
    "2": "canCreateVacation",
    "3": "canCreatePermission",
    "4": "canCreateTimeAdjustment",
};

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

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [pendingEmployeeId, setPendingEmployeeId] = useState(null);
    const permissions = usePermissions();
    const allowedTabs = Object.keys(PERMISSION_BY_TAB).filter(
        (key) => permissions[PERMISSION_BY_TAB[key]]
    );
    const [selectedTab, setActiveTab] = useState("1");
    // Si la pestaña elegida no esta permitida, se usa la primera disponible
    const activeTab = allowedTabs.includes(selectedTab) ? selectedTab : (allowedTabs[0] ?? selectedTab);

    const { employee, loading: employeeLoading } = useCurrentEmployee();
    const {
        record,
        loading: recordLoading,
    } = useMultiFormatRecord(id);
    const {
        employees: managedEmployees,
        loading: managedEmployeesLoading,
        error: managedEmployeesError,
        retry: retryManagedEmployees,
    } = useManagedEmployees();

    const { submit, submitting, isEdit } = useMultiFormatSubmit({
        form,
        id,
        // Al enviar, se redirige al detalle del formato recien creado
        redirectTo: (record) => (record?.id ? `/multiFormat/${record.id}` : "/multiFormat"),
    });

    // Aplica al formulario el formato cargado por el hook compartido.
    useLayoutEffect(() => {
        if (!id || !record) return;

        // Un formato ya enviado no puede modificarse: se manda al detalle.
        if (record.status) {
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
    }, [form, id, navigate, record]);

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
        if (!allowedTabs.includes(activeTab)) {
            displayError(new Error(t("forbidden.message")));
            return;
        }
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
            <Skeleton
                active
                loading={employeeLoading || (Boolean(id) && recordLoading)}
                paragraph={{ rows: 6 }}
            >
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
                                            onRetryEmployees={retryManagedEmployees}
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
                            ].filter((item) => allowedTabs.includes(item.key))}
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
