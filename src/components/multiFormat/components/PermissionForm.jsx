import { Card, Col, DatePicker, Flex, Form, Input, InputNumber, Radio, Row, Upload } from "antd";
import {
    DingdingOutlined,
    FileTextOutlined,
    HeartOutlined,
    InboxOutlined,
    RedditOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";

const { Dragger } = Upload;

const DISPLAY_DATE = "DD/MM/YYYY";

// Tipos que exigen documento comprobatorio
const TYPES_WITH_DOCUMENT = [1, 2, 3];
const SWAP_TYPE = 5;

export default function PermissionForm() {
    const { t } = useTranslation();

    // El tipo de permiso ahora vive en el Form, no en un useState local,
    // asi viaja al backend junto con el resto de los campos.
    const permissionType = Form.useWatch("permissionType");

    const requiredDocument = TYPES_WITH_DOCUMENT.includes(permissionType);

    // Mientras no exista el endpoint de adjuntos, los archivos se quedan
    // en el cliente (beforeUpload -> false).
    const normalizeFiles = (event) => (Array.isArray(event) ? event : event?.fileList ?? []);

    return (
        <Card>
            <Row gutter={2}>
                <Col xs={24} md={24}>
                    <Flex wrap gap="small">
                        <div className={styles.permissionType}>
                            <Form.Item name="permissionType" noStyle>
                                <Radio.Group optionType="button">
                                    <Radio.Button value={1}>
                                        <HeartOutlined /> {t("multiFormat.permission.marriage")}
                                    </Radio.Button>

                                    <Radio.Button value={2}>
                                        <RedditOutlined /> {t("multiFormat.permission.birth")}
                                    </Radio.Button>

                                    <Radio.Button value={3}>
                                        <DingdingOutlined /> {t("multiFormat.permission.death")}
                                    </Radio.Button>

                                    <Radio.Button value={4}>
                                        <FileTextOutlined /> {t("multiFormat.permission.unpaid")}
                                    </Radio.Button>

                                    <Radio.Button value={5}>
                                        <SwapOutlined /> {t("multiFormat.permission.swap")}
                                    </Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Flex>
                </Col>
            </Row>

            {requiredDocument && (
                <Row gutter={2}>
                    <Col xs={24} md={24}>
                        <Form.Item
                            label={t("multiFormat.permission.document.label")}
                            name="attachments"
                            valuePropName="fileList"
                            getValueFromEvent={normalizeFiles}
                            extra={t("multiFormat.permission.document.extra")}
                            rules={[
                                {
                                    required: true,
                                    message: t("multiFormat.permission.document.required"),
                                },
                            ]}
                        >
                            <Dragger name="file" multiple beforeUpload={() => false}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>

                                <p className="ant-upload-text">
                                    {t("multiFormat.permission.document.dragText")}
                                </p>

                                <p className="ant-upload-hint">
                                    {t("multiFormat.permission.document.hint")}
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
            )}

            {permissionType === SWAP_TYPE && (
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label={t("multiFormat.permission.swapDetail.label")}
                            name="swapDetail"
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder={t("multiFormat.permission.swapDetail.placeholder")}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            )}

            <Row gutter={12}>
                <Col xs={24} md={3}>
                    <Form.Item label={t("multiFormat.permission.days")} name="permissionDays">
                        <InputNumber min={1} style={{ width: "100%" }} className={styles.modernInput} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item
                        label={t("multiFormat.permission.startDate")}
                        name="permissionStartDate"
                    >
                        <DatePicker
                            format={DISPLAY_DATE}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.permission.endDate")} name="permissionEndDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item
                        label={t("multiFormat.permission.returnDate")}
                        name="permissionReturnDate"
                    >
                        <DatePicker
                            format={DISPLAY_DATE}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
}
