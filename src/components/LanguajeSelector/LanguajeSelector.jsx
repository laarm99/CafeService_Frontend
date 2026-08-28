
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import Styles from "../LanguajeSelector/LanguajeSelector.module.css"
import { GlobalOutlined } from "@ant-design/icons";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  };

  return (<>
    <div className={Styles.languageSelector}>
      <GlobalOutlined />
      <Select
        className={Styles.selectDesign}
        value={i18n.language}
        onChange={handleChange}
        options={[
          {
            value: "es",
            label: "🇲🇽 Español"
          },
          {
            value: "en",
            label: "🇺🇸 English"
          }
        ]}
      />
    </div>
  </>
  );
};

export default LanguageSelector;
