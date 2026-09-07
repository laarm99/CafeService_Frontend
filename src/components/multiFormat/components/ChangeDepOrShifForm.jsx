import { Card, Col, Form, Input, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";

// Los datos "Actuales" vienen del empleado (solo lectura);
// los "Nuevos" son los que se capturan y viajan al backend.
export default function ChangeDepOrShift({ employee = null }) {
    const { t } = useTranslation();

    const readOnlyValue = (value) => (
        <Input
            value={value ?? ""}
            readOnly
            disabled
            style={{ width: "100%" }}
            className={styles.modernInput}
        />
    );

    const fields = [
        { key: "plant", label: t("multiFormat.change.plant"), name: "newPlant" },
        { key: "shift", label: t("multiFormat.change.shift"), name: "newShift" },
        { key: "department", label: t("multiFormat.change.department"), name: "newDepartment" },
        { key: "supervisor", label: t("multiFormat.change.supervisor"), name: "newSupervisor" },
        { key: "area", label: t("multiFormat.change.area"), name: "newArea" },
    ];

    return (
        <Card>
            <Row gutter={16}>
                <Col span={12}>
                    <Typography.Text strong>{t("multiFormat.change.currentData")}</Typography.Text>
                </Col>
                <Col span={12}>
                    <Typography.Text strong>{t("multiFormat.change.newData")}</Typography.Text>
                </Col>
            </Row>

            {fields.map((field) => (
                <Row gutter={20} key={field.key}>
                    <Col xs={24} md={12}>
                        <Form.Item label={field.label}>
                            {readOnlyValue(employee?.[field.key])}
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={field.label} name={field.name}>
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
            ))}
        </Card>
    );
}
