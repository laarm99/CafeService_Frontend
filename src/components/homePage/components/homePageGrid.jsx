import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getHomeModules, getModuleColors } from "../../../layout/modules";
import styles from "../styles/homePageGrid.module.css";

// Accesos rapidos del home.
// Se generan desde la misma definicion que el menu lateral, con un grid
// auto-fill: al agregar un modulo, el boton aparece y se reacomoda solo.
export default function HomePageGrid() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const modules = getHomeModules();

    return (
        <div className={styles.homeWrapper}>
            <h2 className={styles.homeTitle}>{t("homePage.title")}</h2>

            <div className={styles.moduleGrid}>
                {modules.map((module, index) => {
                    const { startColor, endColor } = getModuleColors(module, index);
                    const Icon = module.icon;

                    return (
                        <button
                            key={module.key}
                            type="button"
                            className={styles.moduleTile}
                            style={{
                                "--start-color": startColor,
                                "--end-color": endColor,
                            }}
                            onClick={() => navigate(module.path)}
                        >
                            <span className={styles.tileContent}>
                                <Icon className={styles.tileIcon} />
                                <span className={styles.tileLabel}>{t(module.labelKey)}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
