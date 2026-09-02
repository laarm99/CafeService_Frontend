import Sider from "antd/es/layout/Sider";
import { useContext, useState } from 'react'
import { AuthContext } from "../pages/login/AuthProvider";
import { Row, Space, Col, App } from 'antd'
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { Content, Header } from "antd/es/layout/layout";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { setMessageApi } from "../services/notificationService";
import wernerLogo from "../assets/img/logo.png";
import styles from "../layout/styles/LayoutApp.module.css"
import LanguageSelector from "../components/LanguajeSelector/LanguajeSelector";
import AppButton from "../components/common/buttons";
import { useTranslation } from "react-i18next";
import { getModuleItems } from "./LayoutItems.jsx";
import LayoutSider from "./LayoutSider.jsx";

export default function AppLayout() {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const { message } = App.useApp();
  setMessageApi(message);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const moduleItems = getModuleItems(t);

  return (
    <Layout className={styles.mainBackground}>

      <LayoutSider moduleItems={moduleItems} />

      <Layout
        style={{
          background: "transparent"
        }}
      >

        <div style={{
          height: "80px"
        }}
          className={styles["divHeaderLayout"]}>
          <img
            className={styles.headerLogo}
            src={wernerLogo}
          />
          <div className={styles.headerActions}>
            <div className={styles.logoutBtn}>
              <AppButton //este es el logout
                title={t("layoutapp.logout")}
                startColor="#91bfff"
                endColor="#1677ff"
                icon={<LogoutOutlined />}
                onClick={logout}
              />
            </div>
            <div className={styles.languageContainer}>
              <LanguageSelector />
            </div>
          </div>

        </div>

        <Header className={styles.headerStyle}>

          <h1>Formato Multiple</h1>

        </Header>

        <Content
          className={styles.contentDesign}
        >
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  );
}

