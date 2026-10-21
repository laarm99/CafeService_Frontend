import {
    FileAddOutlined,
    FileDoneOutlined,
    HomeFilled,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

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
// - permission  regla de utils/permissions.js necesaria para verlo (opcional)
// - children    submodulos: el padre es un menu desplegable sin ruta propia
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
        permission: "canCreateForms",
    },
    {
        key: "3",
        path: "/multiFormat",
        labelKey: "layoutItems.multiFormatList",
        icon: FileDoneOutlined,
        startColor: "#1677ff",
        endColor: "#162852",
        permission: "canViewForms",
    },
    {
        key: "4",
        labelKey: "layoutItems.configuration",
        icon: SettingOutlined,
        permission: "canViewConfiguration",
        children: [
            {
                key: "4-1",
                path: "/configuration/supervisors",
                labelKey: "layoutItems.supervisors",
                icon: TeamOutlined,
                startColor: "#13c2c2",
                endColor: "#08757c",
                permission: "canManageSupervisors",
            },
            {
                key: "4-2",
                path: "/configuration/users",
                labelKey: "layoutItems.users",
                icon: UserOutlined,
                startColor: "#722ed1",
                endColor: "#3b1273",
                permission: "canManageUsers",
            },
        ],
    },
];

// Deja solo los modulos permitidos; un padre sin hijos visibles tambien se oculta.
export const filterModules = (modules, permissions) =>
    modules.reduce((acc, module) => {
        if (module.permission && !permissions[module.permission]) return acc;

        if (module.children) {
            const children = filterModules(module.children, permissions);
            if (children.length > 0) acc.push({ ...module, children });
            return acc;
        }

        acc.push(module);
        return acc;
    }, []);


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

// Modulos que se muestran como botones en el home (solo los permitidos y sin padres)
export const getHomeModules = (permissions) =>
    filterModules(MODULES, permissions)
        .flatMap((m) => m.children ?? [m])
        .filter((m) => m.showInHome !== false);
