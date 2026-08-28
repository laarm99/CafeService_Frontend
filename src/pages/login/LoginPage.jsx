import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from "antd";
import { Login } from "./api/LoginApi";
import displayError from "../../Utils/display-errors";
import { AuthContext } from "./AuthProvider";
import styles from "../login/styles/LoginPage.module.css"
import AppButton from "../../components/common/buttons";
import { useTranslation } from "react-i18next";
import { LoginOutlined } from "@ant-design/icons";
import appLogo from "../../assets/img/logo.png"

export default function LoginPage() {
  const { loginCtx } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginErrors, setLoginErrors] = useState();
  const { t } = useTranslation();

  const onFinish = async () => {
    try {
      const res = await Login();
      const data = res.data;

      console.log("LOGIN OK", data);

loginCtx(data);

navigate("/homePage");

    } catch (error) {
      setLoginErrors(error.response?.data);
      displayError(error);
    }
  };

  return (
    <div className={styles.mainBackground}>
      <div>
        
      </div>
      
      <Card className={styles.contentDesign}>
        {loginErrors && (
          <Alert
            message={loginErrors}
            type="error"
            style={{ marginBottom: 16 }}
          />
        )}

        <img
          src={appLogo}
          alt="APP Logo"
          className={styles.loginLogo}
        />

        <p>
          Welcome to APP
        </p>

        <Form onFinish={onFinish}>
          <Form.Item>
             <AppButton
                    title={t("dashboard.login")}
                    icon={<LoginOutlined style={{ fontSize: 25 }} />}
                    startColor="#fb8421"
                    endColor="#162852"
                    loading={false}
                    disabled={false}
                  htmlType="submit"
                />
            {/* <Button type="primary" htmlType="submit" block>
              Accesar
            </Button> */}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
