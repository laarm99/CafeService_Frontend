import { Breadcrumb, Button, Tooltip } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./styles/AppBreadcrumb.module.css";

// Rutas de migaja definidas por pantalla (no por segmento de URL),
// asi cada ruta muestra exactamente los niveles que le corresponden.
// Para una pantalla nueva, se agrega su ruta aqui.
//
//   path        ruta declarada en main.jsx (":id" para el parametro)
//   backTo      a donde lleva la flecha de retorno. Regla: siempre al nivel
//               anterior del breadcrumb, para que la flecha y la migaja digan
//               lo mismo (si la migaja es "Inicio / Crear Nuevo",
//               la flecha regresa a Inicio).
//   trail       niveles despues de Inicio. Cada uno:
//               { labelKey } o { folio: true }, y "to" si debe ser clicable.
const BREADCRUMB_TRAILS = [
    {
        path: "/multiFormat/new",
        backTo: "/homePage",
        trail: [{ labelKey: "multiFormat.title.create" }],
    },
    {
        path: "/multiFormat/:id",
        backTo: "/multiFormat",
        trail: [
            { labelKey: "layoutItems.multiFormatList", to: "/multiFormat" },
            { folio: true },
        ],
    },
    {
        path: "/multiFormat",
        backTo: "/homePage",
        trail: [{ labelKey: "layoutItems.multiFormatList" }],
    },
];

// Compara la ruta actual contra un patron con parametros (":id")
function matchTrail(pathname) {
    const segments = pathname.split("/").filter(Boolean);

    return BREADCRUMB_TRAILS.find((entry) => {
        const pattern = entry.path.split("/").filter(Boolean);
        if (pattern.length !== segments.length) return false;

        return pattern.every((part, i) => part.startsWith(":") || part === segments[i]);
    });
}

export default function AppBreadcrumb() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const segments = pathname.split("/").filter(Boolean);
    const match = matchTrail(pathname);

    // En el home (o en rutas sin migaja definida) no se muestra nada
    if (!match || segments.length === 0) return null;

    const lastSegment = segments[segments.length - 1];

    const items = [
        {
            title: (
                <Link to="/homePage">
                    <HomeOutlined /> {t("layoutUtems.home")}
                </Link>
            ),
        },
        ...match.trail.map((level) => {
            const title = level.folio
                ? `${t("multiFormat.detail.folio")} #${lastSegment}`
                : t(level.labelKey);

            return { title: level.to ? <Link to={level.to}>{title}</Link> : title };
        }),
    ];

    return (
        <div className={styles.breadcrumbBar}>
            <Tooltip title={t("multiFormat.detail.back")}>
                <Button
                    type="text"
                    shape="circle"
                    aria-label={t("multiFormat.detail.back")}
                    className={styles.backButton}
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(match.backTo ?? -1)}
                />
            </Tooltip>

            <Breadcrumb items={items} />
        </div>
    );
}
