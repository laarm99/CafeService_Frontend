import { useState } from "react";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Tag, Tooltip } from "antd";
import { EditOutlined, StopOutlined, CheckCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import DefaultTable from "../../common/defaultTable";
import formStyles from "../../multiFormat/styles/MultiFormatForm.module.css";
import styles from "../styles/Configuration.module.css";
import useConfigurationList from "../hooks/useConfigurationList";
import { getSupervisors, setSupervisorStatus, updateSupervisor } from "../api/ConfigurationApi";
import { notifySuccess } from "../../../utils/messages";

export default function SupervisorsGrid() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { dataSource, loading, processingId, mutate } = useConfigurationList(getSupervisors);

    const [editing, setEditing] = useState(null);
    const processing = processingId !== null;

    const openEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({ domainUserName: record.domainUserName, email: record.email });
    };

    const closeEdit = () => {
        if (processing) return;
        setEditing(null);
        form.resetFields();
    };

    const handleSave = async (values) => {
        const ok = await mutate(editing.id, () => updateSupervisor(editing.id, {
            domainUserName: values.domainUserName.trim(),
            email: values.email.trim(),
        }));

        if (ok) {
            notifySuccess(t("configuration.supervisors.updated"));
            setEditing(null);
            form.resetFields();
        }
    };

    const handleStatus = async (record, isActive) => {
        const ok = await mutate(record.id, () => setSupervisorStatus(record.id, isActive));
        if (ok) {
            notifySuccess(t(isActive
                ? "configuration.supervisors.enabled"
                : "configuration.supervisors.disabled"));
        }
    };

    const columns = [
        { title: t("configuration.supervisors.fullName"), dataIndex: "fullName", key: "fullName" },
        { title: t("configuration.netkey"), dataIndex: "domainUserName", key: "domainUserName" },
        { title: t("configuration.email"), dataIndex: "email", key: "email", render: (v) => v || "-" },
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
                    <Tooltip title={t("configuration.supervisors.edit")}>
                        <Button
                            icon={<EditOutlined />}
                            disabled={processing}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    {record.isActive ? (
                        <Popconfirm
                            title={t("configuration.supervisors.disableTitle")}
                            description={t("configuration.supervisors.disableDescription", {
                                name: record.fullName,
                            })}
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
                        <TeamOutlined className={formStyles.headerIcon} />
                        {t("layoutItems.supervisors")}
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
                title={t("configuration.supervisors.edit")}
                okText={t("dashboard.save")}
                cancelText={t("configuration.cancel")}
                confirmLoading={processing}
                cancelButtonProps={{ disabled: processing }}
                maskClosable={false}
                keyboard={!processing}
                closable={!processing}
                onOk={() => form.submit()}
                onCancel={closeEdit}
                destroyOnHidden
                forceRender
            >
                <Form form={form} layout="vertical" onFinish={handleSave} disabled={processing}>
                    <Form.Item
                        name="domainUserName"
                        label={t("configuration.netkey")}
                        rules={[
                            { required: true, whitespace: true, message: t("configuration.validation.netkeyRequired") },
                            { max: 100, message: t("configuration.validation.tooLong") },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={t("configuration.email")}
                        rules={[
                            { required: true, whitespace: true, message: t("configuration.validation.emailRequired") },
                            { type: "email", message: t("configuration.validation.emailInvalid") },
                            { max: 256, message: t("configuration.validation.tooLong") },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
