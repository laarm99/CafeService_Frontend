import { Button } from "antd";
import styles from "../common/styles/buttons.module.css"

export default function AppButton({ title, startColor = "#fb8421", endColor = "#162852", ...props }) {

    return (
        <>
            <Button
                {...props}
                className={styles["appButton"]}
                type="primary"                
                style={{
                    "--start-color": startColor,
                    "--end-color": endColor,
                }}
            >
                {title}
            </Button>
        </>
    )
}