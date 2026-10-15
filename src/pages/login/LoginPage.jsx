import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Card, Form } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { Login } from "./api/LoginApi";
import { AuthContext } from "./AuthProvider";
import AppButton from "../../components/common/buttons";
import styles from "./styles/LoginPage.module.css";
import appLogo from "../../assets/img/logo.png";

function getLoginErrorMessage(error, t) {
  const status = error.response?.status;

  // Mensajes controlados para los errores de acceso.
  if (status === 401) {
    return t("login.errors.unauthenticated");
  }

  if (status === 403) {
    return t("login.errors.forbidden");
  }

  if (status === 503) {
    return t("login.errors.unavailable");
  }

  // Cancelación o problema de conexión.
  if (!error.response) {
    return t("login.errors.connection");
  }

  // No mostrar detalles internos de errores del servidor.
  if (status >= 500) {
    return t("login.errors.server");
  }

  // Admitir respuestas controladas con texto o con { message }.
  const data = error.response.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (
    typeof data?.message === "string" &&
    data.message.trim()
  ) {
    return data.message;
  }

  return t("login.errors.generic");
}

export default function LoginPage() {
  const { loginCtx } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bloquear envíos repetidos antes de que React
  // actualice el estado visual del botón.
  const requestInProgress = useRef(false);

  const onFinish = async () => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;
    setLoading(true);
    setLoginError(null);

    try {
      // El navegador utiliza la identidad Windows.
      // No enviamos usuario, contraseña ni token Bearer.
      const response = await Login();
      const user = response.data;

      if (
        !user ||
        typeof user !== "object" ||
        typeof user.domainUserName !== "string" ||
        !user.domainUserName.trim() ||
        user.isActive !== true
      ) {
        setLoginError(t("login.errors.invalidResponse"));
        return;
      }

      loginCtx(user);

      // Entrar al inicio sin conservar el login
      // como pantalla anterior en el historial.
      navigate("/homePage", { replace: true });
    } catch (error) {
      setLoginError(getLoginErrorMessage(error, t));
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainBackground}>
      <Card className={styles.contentDesign}>
        {loginError && (
          <Alert
            message={loginError}
            type="error"
            showIcon
            closable
            onClose={() => setLoginError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <img
          src={appLogo}
          alt={t("app.title")}
          className={styles.loginLogo}
        />

        <p>{t("login.welcome")}</p>

        <Form onFinish={onFinish}>
          <Form.Item>
            <AppButton
              title={t("dashboard.login")}
              icon={
                <LoginOutlined
                  style={{ fontSize: 25 }}
                />
              }
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
// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, Card, Alert } from "antd";
// import { Login } from "./api/LoginApi";
// import displayError from "../../utils/display-errors";
// import { AuthContext } from "./AuthProvider";
// import styles from "../login/styles/LoginPage.module.css"
// import AppButton from "../../components/common/buttons";
// import { useTranslation } from "react-i18next";
// import { LoginOutlined } from "@ant-design/icons";
// import appLogo from "../../assets/img/logo.png"

// export default function LoginPage() {
//   const { loginCtx } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [loginErrors, setLoginErrors] = useState();
//   const [loading, setLoading] = useState(false);
//   const { t } = useTranslation();

//   const onFinish = async () => {
//     setLoading(true);
//     try {
//       const res = await Login();
//       const data = res.data;

//       loginCtx(data);
//       navigate("/");
//     } catch (error) {
//       setLoginErrors(error.response?.data);
//       displayError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.mainBackground}>
//       <Card className={styles.contentDesign}>
//         {loginErrors && (
//           <Alert
//             message={loginErrors}
//             type="error"
//             style={{ marginBottom: 16 }}
//           />
//         )}

//         <img
//           src={appLogo}
//           alt="APP Logo"
//           className={styles.loginLogo}
//         />

//         <p>
//           {t("login.welcome")}
//         </p>

//         <Form onFinish={onFinish}>
//           <Form.Item>
//             <AppButton
//               title={t("dashboard.login")}
//               icon={<LoginOutlined style={{ fontSize: 25 }} />}
//               startColor="#fb8421"
//               endColor="#162852"
//               loading={loading}
//               disabled={loading}
//               htmlType="submit"
//             />
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }
