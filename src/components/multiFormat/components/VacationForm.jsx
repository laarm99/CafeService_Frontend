import { Card, Col, DatePicker, Form, Input, Row } from "antd";
import styles from "../styles/MultiFormatForm.module.css"
import { ArrowRightOutlined } from "@ant-design/icons";

export default function VacationsForm() {

    return (
        <>
            <Card>
                <Row gutter={2}>
                            <Col xs={24} md={3}>
                                <Form.Item label="# de Dias">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item label="Fecha de Inicio">
                                    <DatePicker style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                             {/* <Col xs={24} md={1}>
                                <ArrowRightOutlined />
                            </Col> */}
                            <Col xs={24} md={7}>
                                <Form.Item label="Fecha de Termino">
                                    <DatePicker style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item label="Se presentara a trabajar el dia">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                        </Row>
            </Card>
        </>
    )
}