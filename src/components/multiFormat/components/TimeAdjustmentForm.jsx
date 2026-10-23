import { Card, Col, DatePicker, Form, Input, Radio, Row, TimePicker } from "antd";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";
import { disabledFutureAndCutoff } from "../../../utils/date-rules";

const DISPLAY_DATE = "DD/MM/YYYY";
const MISSING_PUNCH_TYPE = {
    ENTRY: 1,
    EXIT: 2,
    BOTH: 3,
};

export default function TimeAdjustmentForm() {
    const { t } = useTranslation();
    const missingPunchType = Form.useWatch("missingPunchType");

    return (
        <Card>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("multiFormat.timeAdjustment.date")}
                        name="adjustmentDate"
                        rules={[{ required: true, message: t("multiFormat.timeAdjustment.dateRequired") }]}
                    >
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledFutureAndCutoff}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("multiFormat.timeAdjustment.missingPunchType")}
                        name="missingPunchType"
                        rules={[{ required: true, message: t("multiFormat.timeAdjustment.typeRequired") }]}
                    >
                        <Radio.Group optionType="button">
                            <Radio.Button value={MISSING_PUNCH_TYPE.ENTRY}>
                                {t("multiFormat.timeAdjustment.entry")}
                            </Radio.Button>
                            <Radio.Button value={MISSING_PUNCH_TYPE.EXIT}>
                                {t("multiFormat.timeAdjustment.exit")}
                            </Radio.Button>
                            <Radio.Button value={MISSING_PUNCH_TYPE.BOTH}>
                                {t("multiFormat.timeAdjustment.both")}
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {[MISSING_PUNCH_TYPE.ENTRY, MISSING_PUNCH_TYPE.BOTH].includes(missingPunchType) && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t("multiFormat.timeAdjustment.entryTime")}
                            name="entryTime"
                            rules={[{ required: true, message: t("multiFormat.timeAdjustment.entryTimeRequired") }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: "100%" }}
                                className={styles.modernInput}
                            />
                        </Form.Item>
                    </Col>
                )}
                {[MISSING_PUNCH_TYPE.EXIT, MISSING_PUNCH_TYPE.BOTH].includes(missingPunchType) && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t("multiFormat.timeAdjustment.exitTime")}
                            name="exitTime"
                            rules={[{ required: true, message: t("multiFormat.timeAdjustment.exitTimeRequired") }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: "100%" }}
                                className={styles.modernInput}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>
            <Form.Item
                label={t("multiFormat.timeAdjustment.justification")}
                name="justification"
                rules={[{
                    required: true,
                    whitespace: true,
                    message: t("multiFormat.timeAdjustment.justificationRequired"),
                }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>
        </Card>
    );
}
