import { Card, Col, DatePicker, Form, InputNumber, Row } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";
import { calculateDays } from "../../../utils/date-calculations";
import { useEffect, useState } from "react";

const DISPLAY_DATE = "DD/MM/YYYY";

export default function VacationsForm() {
    const { t } = useTranslation();
    const form = Form.useFormInstance();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");    

    const disabledDate = (current) =>
        current && current.isBefore(dayjs().startOf("day"), "day");

    useEffect(() => {
    const days = calculateDays(startDate, endDate);

    form.setFieldsValue({
        vacationDays: days
    });

}, [startDate, endDate, form]);


    return (
        <Card>
            <Row gutter={12}>
                <Col xs={24} md={3}>
                    <Form.Item label={t("multiFormat.vacation.days")} name="vacationDays">
                        <InputNumber disabled  className={styles.modernInput} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.startDate")} name="vacationStartDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                            onChange={(date) =>
                                setStartDate(date ? date.format("YYYY-MM-DD") : "")}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.endDate")} name="vacationEndDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                            onChange={(date) =>
                                setEndDate(date ? date.format("YYYY-MM-DD") : "")}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.returnDate")} name="vacationReturnDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
}
