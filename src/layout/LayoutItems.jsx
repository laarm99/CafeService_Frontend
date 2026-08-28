
import { HomeFilled, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const getModuleItems = (t) => [
  {
    key: "1",
    icon: <HomeFilled />,
    label: <Link to="/homePage">{t("layoutUtems.home")}</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to="/fooPage">Foo</Link>,
  },
];
