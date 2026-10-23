import { Card, Col, DatePicker, Form, InputNumber, Row } from "antd";
import { useTranslation } from "react-i18next";
import styles from "../styles/MultiFormatForm.module.css";
import { calculateDays } from "../../../utils/date-calculations";
import { disabledBeforeDate } from "../../../utils/date-rules";
import { useEffect, useState } from "react";

const DISPLAY_DATE = "DD/MM/YYYY";

export default function VacationsForm() {
    const { t } = useTranslation();
    const form = Form.useFormInstance();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");    

    const startValue = Form.useWatch("vacationStartDate", form);
    const endValue = Form.useWatch("vacationEndDate", form);
    const disabledStart = disabledBeforeDate(null);
    const disabledEnd = disabledBeforeDate(startValue);
    const disabledReturn = disabledBeforeDate(endValue || startValue, false);

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
                            disabledDate={disabledStart}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                            onChange={(date) =>
                                { setStartDate(date ? date.format("YYYY-MM-DD") : ""); form.setFieldsValue({ vacationEndDate: undefined, vacationReturnDate: undefined }); }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.endDate")} name="vacationEndDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledEnd}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                            onChange={(date) =>
                                { setEndDate(date ? date.format("YYYY-MM-DD") : ""); form.setFieldsValue({ vacationReturnDate: undefined }); }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={7}>
                    <Form.Item label={t("multiFormat.vacation.returnDate")} name="vacationReturnDate">
                        <DatePicker
                            format={DISPLAY_DATE}
                            disabledDate={disabledReturn}
                            style={{ width: "100%" }}
                            className={styles.modernInput}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
}
