import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Card, Alert } from "antd";
import { Login } from "./api/LoginApi";
import displayError from "../../utils/display-errors";
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
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = async () => {
    setLoading(true);
    try {
      const res = await Login();
      const data = res.data;

      loginCtx(data);
      navigate("/");
    } catch (error) {
      setLoginErrors(error.response?.data);
      displayError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainBackground}>
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
          {t("login.welcome")}
        </p>

        <Form onFinish={onFinish}>
          <Form.Item>
            <AppButton
              title={t("dashboard.login")}
              icon={<LoginOutlined style={{ fontSize: 25 }} />}
              startColor="#fb8421"
              endColor="#162852"
              loading={loading}
              disabled={loading}
              htmlType="submit"
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
