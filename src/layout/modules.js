import { FileAddOutlined, FileDoneOutlined, HomeFilled } from "@ant-design/icons";

// FUENTE UNICA de los modulos de la app.
// El menu lateral y los accesos del home se generan de aqui:
// agrega un objeto y aparece en los dos lugares, sin tocar nada mas.
//
// - path        ruta declarada en main.jsx
// - labelKey    clave de i18next (es.json / en.json)
// - icon        componente de @ant-design/icons
// - startColor / endColor  degradado del boton del home (opcional:
//   si no se define, se toma un color de la paleta por posicion)
// - showInHome  false para que no aparezca como boton en el home
export const MODULES = [
    {
        key: "1",
        path: "/homePage",
        labelKey: "layoutUtems.home",
        icon: HomeFilled,
        showInHome: false,
    },
    {
        key: "2",
        path: "/multiFormat/new",
        labelKey: "layoutItems.newMultiFormat",
        icon: FileAddOutlined,
        startColor: "#fb8421",
        endColor: "#f25c05",
    },
    {
        key: "3",
        path: "/multiFormat",
        labelKey: "layoutItems.multiFormatList",
        icon: FileDoneOutlined,
        startColor: "#1677ff",
        endColor: "#162852",
    },
];

// Paleta de respaldo: si un modulo nuevo no trae colores, toma uno de aqui
// segun su posicion, para que nunca salga un boton sin estilo.
export const FALLBACK_PALETTE = [
    { startColor: "#fb8421", endColor: "#f25c05" },
    { startColor: "#1677ff", endColor: "#162852" },
    { startColor: "#13c2c2", endColor: "#08757c" },
    { startColor: "#722ed1", endColor: "#3b1273" },
    { startColor: "#52c41a", endColor: "#237804" },
    { startColor: "#eb2f96", endColor: "#9e1068" },
];

export const getModuleColors = (module, index) => ({
    startColor: module.startColor ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length].startColor,
    endColor: module.endColor ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length].endColor,
});

// Modulos que se muestran como botones en el home
export const getHomeModules = () => MODULES.filter((m) => m.showInHome !== false);
