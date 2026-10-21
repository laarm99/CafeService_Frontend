import { Link } from "react-router-dom";
import { MODULES, filterModules } from "./modules";

const toMenuItem = (t) => ({ key, path, labelKey, icon: Icon, children }) => ({
  key,
  icon: <Icon />,
  label: path ? <Link to={path}>{t(labelKey)}</Link> : t(labelKey),
  ...(children ? { children: children.map(toMenuItem(t)) } : {}),
});

// El menu lateral se arma desde la definicion compartida de modulos,
// mostrando solo lo que el rol del usuario permite.
export const getModuleItems = (t, permissions) =>
  filterModules(MODULES, permissions).map(toMenuItem(t));
