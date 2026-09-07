import { Link } from "react-router-dom";
import { MODULES } from "./modules";

// El menu lateral se arma desde la definicion compartida de modulos.
export const getModuleItems = (t) =>
  MODULES.map(({ key, path, labelKey, icon: Icon }) => ({
    key,
    icon: <Icon />,
    label: <Link to={path}>{t(labelKey)}</Link>,
  }));
