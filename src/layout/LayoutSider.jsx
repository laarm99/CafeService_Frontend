import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import style from "../layout/styles/LayoutSider.module.css"

export default function LayoutSider({ moduleItems }) {    
    const [collapsed, setCollapsed] = useState(true);
    return (
        <>
            <Sider
            className={style.siderStyle}
                trigger={null}
                collapsible
                collapsed={collapsed}
                collapsedWidth={70}
                //width={250}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}               
            >
                <div className="demo-logo-vertical">
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        items={moduleItems}
                    />
                </div>
            </Sider>
        </>
    )
}