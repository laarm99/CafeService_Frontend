import { useContext, useState } from "react";
import { Alert, App, Button, Card, Form, Modal, Popconfirm, Select, Space, Tag, Tooltip } from "antd";
import { CheckCircleOutlined, SafetyCertificateOutlined, StopOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import DefaultTable from "../../common/defaultTable";
import formStyles from "../../multiFormat/styles/MultiFormatForm.module.css";
import styles from "../styles/Configuration.module.css";
import useConfigurationList from "../hooks/useConfigurationList";
import { getUsers, setUserStatus, updateUserRole } from "../api/ConfigurationApi";
import { AuthContext } from "../../../pages/login/AuthProvider";
import { ROLES } from "../../../utils/permissions";
import { notifySuccess } from "../../../utils/messages";
import RolesDisplay from "../../common/RolesDisplay";

const ROLE_COLORS = {
    [ROLES.ADMIN]: "red",
    [ROLES.SUPERVISOR]: "blue",
    [ROLES.GENERAL]: "default",
};

const sameUser = (a, b) =>
    Boolean(a) && Boolean(b) && String(a).toLowerCase() === String(b).toLowerCase();

export default function UsersGrid() {
    const { t } = useTranslation();
    const { modal } = App.useApp();
    const { auth } = useContext(AuthContext);
    const [form] = Form.useForm();
    const { dataSource, loading, processingId, mutate } = useConfigurationList(getUsers);

    const [editing, setEditing] = useState(null);
    const processing = processingId !== null;

    const roleLabel = (role) => (role ? t(`configuration.roles.${role}`, { defaultValue: role }) : "-");
    const isSelf = (record) => sameUser(record?.domainUserName, auth?.user?.domainUserName);

    // Opciones: valores exactos del backend (ROLES), no identificadores internos
    const roleOptions = Object.values(ROLES).map((role) => ({ value: role, label: roleLabel(role) }));

    const openRole = (record) => {
        setEditing(record);
        // Backend devuelve roles como array; seleccionar el primero como default (por ahora)
        form.setFieldsValue({ role: record.roles?.[0] || undefined });
    };

    const closeRole = () => {
        if (processing) return;
        setEditing(null);
        form.resetFields();
    };

    const saveRole = async (role) => {
        const ok = await mutate(editing.id, () => updateUserRole(editing.id, role));
        if (ok) {
            notifySuccess(t("configuration.users.roleUpdated"));
            setEditing(null);
            form.resetFields();
        }
    };

    // Confirmacion antes de cambiar el rol (con advertencia si es el propio usuario)
    const handleRoleSubmit = ({ role }) => {
        const currentRole = editing.roles?.[0];
        if (!role || role === currentRole) {
            setEditing(null);
            form.resetFields();
            return;
        }

        modal.confirm({
            title: t("configuration.users.roleConfirmTitle"),
            content: (
                <>
                    <p>
                        {t("configuration.users.roleConfirmDescription", {
                            name: editing.fullName,
                            role: roleLabel(role),
                        })}
                    </p>
                    {isSelf(editing) && (
                        <Alert type="warning" showIcon message={t("configuration.users.selfRoleWarning")} />
                    )}
                </>
            ),
            okText: t("configuration.confirm"),
            cancelText: t("configuration.cancel"),
            onOk: () => saveRole(role),
        });
    };

    const handleStatus = async (record, isActive) => {
        const ok = await mutate(record.id, () => setUserStatus(record.id, isActive));
        if (ok) {
            notifySuccess(t(isActive ? "configuration.users.enabled" : "configuration.users.disabled"));
        }
    };

    const columns = [
        { title: t("configuration.users.fullName"), dataIndex: "fullName", key: "fullName" },
        { title: t("configuration.netkey"), dataIndex: "domainUserName", key: "domainUserName" },
        {
            title: t("configuration.users.role"),
            dataIndex: "roles",
            key: "roles",
            render: (roles) => (
                roles && roles.length > 0 ? (
                    <RolesDisplay roles={roles} />
                ) : (
                    <span>{t("configuration.users.noRole")}</span>
                )
            ),
        },
        {
            title: t("configuration.status"),
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {t(isActive ? "configuration.active" : "configuration.inactive").toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t("configuration.users.changeRole")}>
                        <Button
                            icon={<SafetyCertificateOutlined />}
                            disabled={processing}
                            onClick={() => openRole(record)}
                        />
                    </Tooltip>

                    {record.isActive ? (
                        <Popconfirm
                            title={t("configuration.users.disableTitle")}
                            description={isSelf(record)
                                ? t("configuration.users.selfDisableWarning")
                                : t("configuration.users.disableDescription", { name: record.fullName })}
                            okText={t("configuration.confirm")}
                            cancelText={t("configuration.cancel")}
                            onConfirm={() => handleStatus(record, false)}
                        >
                            <Tooltip title={t("configuration.disable")}>
                                <Button
                                    danger
                                    icon={<StopOutlined />}
                                    disabled={processing}
                                    loading={processingId === record.id}
                                />
                            </Tooltip>
                        </Popconfirm>
                    ) : (
                        <Tooltip title={t("configuration.enable")}>
                            <Button
                                icon={<CheckCircleOutlined />}
                                disabled={processing}
                                loading={processingId === record.id}
                                onClick={() => handleStatus(record, true)}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <div className={formStyles.cardHeader}>
                    <h2>
                        <UserOutlined className={formStyles.headerIcon} />
                        {t("layoutItems.users")}
                    </h2>
                </div>
            }
            className={formStyles.modernCard}
        >
            <DefaultTable
                columns={columns}
                data={dataSource}
                loading={loading}
                rowKey="id"
                rowClassName={(record) => (record.isActive ? "" : styles.inactiveRow)}
                scroll={{ x: "max-content" }}
            />

            <Modal
                open={Boolean(editing)}
                title={t("configuration.users.changeRole")}
                okText={t("dashboard.save")}
                cancelText={t("configuration.cancel")}
                confirmLoading={processing}
                cancelButtonProps={{ disabled: processing }}
                maskClosable={false}
                keyboard={!processing}
                closable={!processing}
                onOk={() => form.submit()}
                onCancel={closeRole}
                destroyOnHidden
                forceRender
            >
                {editing && isSelf(editing) && (
                    <Alert
                        type="warning"
                        showIcon
                        message={t("configuration.users.selfRoleWarning")}
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form form={form} layout="vertical" onFinish={handleRoleSubmit} disabled={processing}>
                    <Form.Item
                        name="role"
                        label={t("configuration.users.role")}
                        rules={[{ required: true, message: t("configuration.validation.roleRequired") }]}
                    >
                        <Select options={roleOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
