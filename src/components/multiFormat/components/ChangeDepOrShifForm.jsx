import { Card, Col, Form, Input, Row, Typography } from "antd";
import styles from "../styles/MultiFormatForm.module.css"

export default function ChangeDepOrShift() {

    return (
        <>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Typography.Text strong>
                            Datos Actuales:
                        </Typography.Text>
                    </Col>
                    <Col span={12}>
                        <Typography.Text strong>
                            Datos Nuevos:
                        </Typography.Text>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Planta">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Planta">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Turno">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Turno">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Departamento">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Departamento">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Supervisor">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Supervisor">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Area">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Area">
                            <Input style={{ width: "100%" }} className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </>
    )
}