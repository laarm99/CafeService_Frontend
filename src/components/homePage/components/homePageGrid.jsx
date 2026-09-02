import { App, Button, Card, Form } from "antd";
import { useEffect } from "react";
import { getAll } from "../api/homePageGridAPI";
import { notifyError, notifySuccess } from "../../../services/notificationService";
import AppButton from "../../common/buttons";
import { RightCircleFilled, RightOutlined } from "@ant-design/icons";
import style from "../styles/homePageGrid.module.css"
import { useTranslation } from "react-i18next";


export default function HomePageGrid() {
    const { t } = useTranslation();

    useEffect(() => {
        getAll()
            .then((res) => {                
                notifySuccess("eureka");
            })
            .catch((err) => {                
                notifyError('err');
            });
    }, []);

    return (
        <>
            <Card title="Requisiciones">
                <Form>
                    
                </Form>

            </Card>

            <div className={style["divButton"]}>
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
        </>
    );
}