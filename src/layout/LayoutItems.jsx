
import { FileAddOutlined, FileDoneOutlined, HomeFilled, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const getModuleItems = (t) => [
  {
    key: "1",
    icon: <HomeFilled />,
    label: <Link to="/homePage">{t("layoutUtems.home")}</Link>,
  },
  {
    key: "2",
    icon: <FileAddOutlined />,
    label: <Link to="/add-requisition">Nuevo Formato Multiple</Link>,
  },
  {
    key: "3",
    icon: <FileDoneOutlined />,
    label: <Link to="/requisition">Lista de Formatos Multiples</Link>,
  },
];
