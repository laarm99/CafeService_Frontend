import { useEffect, useState } from "react";
import { getAll } from "../api/MultiFormatApi";
import displayError from "../../../Utils/display-errors";
import { Button, Card, Col, DatePicker, Flex, Form, Input, InputNumber, Radio, Row, Select, Tabs, TimePicker, Typography } from "antd";
import styles from "../styles/MultiFormatForm.module.css"
import AppButton from "../../common/buttons";
import { useTranslation } from "react-i18next";
import { AndroidOutlined, AppleOutlined, FileProtectOutlined, FileTextOutlined, HeartOutlined, RightCircleFilled, SunOutlined, SwapLeftOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ChangeDepOrShift from "./ChangeDepOrShifForm";
import VacationsForm from "./VacationForm";
import PermissionForm from "./PermissionForm";


export default function MultiFormatForm() {
    const { t } = useTranslation();
    const [foos, setFoos] = useState([]);
    useEffect(() => {
        getAll()
            .then((res) => {
                setFoos(res.data);
            })
            .catch((err) => {
                displayError(err);
            })
    }, []);

    const options = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
    ];
    return (<>
        <Card title={
            <div className={styles.cardHeader}>
                <div>
                    <h2>
                        <FileTextOutlined className={styles.headerIcon} />
                        Crear Nuevo
                    </h2>
                </div>
            </div>
        }
            className={styles.modernCard}>
            <Form
                layout="vertical"
                style={{ width: "100%" }}
            >
                <Card className={styles.modernCardEmployeData} title="Datos de empleado">

                    <div className={styles.cardHeader}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Typography.Text strong>
                                    Fecha actual:
                                </Typography.Text>
                                <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
                                    {' '}02/09/2026
                                </Typography.Text>
                            </Col>
                        </Row>

                        <br />

                        <Row gutter={2}>
                            <Col xs={24} md={3}>
                                <Form.Item label="# de Reloj">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item label="Nombre de Empleado">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item label="Puesto Actual">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item label="Departamento">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={2}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Fecha de ingreso">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Fecha efectiva del movimiento">
                                    <Input style={{ width: "100%" }} className={styles.modernInput} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </div>
                </Card>

                <br />

                <Card className={styles.modernCardEmployeData} title="Tipo de movimiento">                   
                    <Tabs
                        defaultActiveKey="1
                        "
                        items={[
                            { key: '1', label: 'CAMBIO DEP. Y/O TURNO', children: <ChangeDepOrShift/>, icon: <SwapOutlined /> },
                            { key: '2', label: 'VACACIONES', children: <VacationsForm />, icon: <SunOutlined /> },
                            { key: '3', label: 'PERMISO', children: <PermissionForm />, icon: <FileProtectOutlined /> },
                        ]}
                    />
                </Card>

                {/* 
                <Form.Item label="Evento">
                    <Input className={styles.modernInput} />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Fecha">
                            <DatePicker
                                className={styles.modernInput}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Hora">
                            <TimePicker
                                className={styles.modernInput}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Planta">
                            <Select
                                className={styles.modernInput}
                                options={[{ label: "J1", value: 1 }]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Lugar">
                            <Input className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="# de asistentes">
                            <InputNumber
                                className={styles.modernInput}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Justificación">
                            <Input className={styles.modernInput} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Persona que autoriza">
                            <Select
                                className={styles.modernInput}
                                options={[{ label: "Demo", value: "demo" }]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Cargar a cuenta">
                            <Select
                                className={styles.modernInput}
                                options={[{ label: "STAFF", value: 2 }]}
                            />
                        </Form.Item>
                    </Col>
                </Row> */}
            </Form>

            <div className={styles["divButton"]}>
                <AppButton
                    title={t("dashboard.next")}
                    icon={<RightCircleFilled style={{ fontSize: 25 }} />}
                    startColor="#fb8421"
                    endColor="#162852"
                    loading={false}
                    disabled={false}
                    onClick={() => notifySuccess("Clic")}
                />
            </div>

        </Card>


    </>);
}