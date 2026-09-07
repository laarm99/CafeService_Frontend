import { Card, Col, DatePicker, Form, InputNumber, Row } from "antd";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";

const DISPLAY_DATE = "DD/MM/YYYY";

export default function VacationsForm() {
    const { t } = useTranslation();

    return (
        <Card>
            <Row gutter={12}>
                <Col xs={24} md={3}>
                    <Form.Item label={t("multiFormat.vacation.days")} name="vacationDays">
                        <InputNumber min={1} style={{ width: "100%" }} className={styles.modernInput} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.startDate")} name="vacationStartDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.endDate")} name="vacationEndDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.returnDate")} name="vacationReturnDate">
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
