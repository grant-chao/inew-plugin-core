import styles from './index.scss';
import Icon from "@/components/icon";
import ControlCenter from "inew-plugin-core/control-center";
import SearchBar from "inew-plugin-core/search-bar";
import React from "react";

const Header = (props) => {
    const { main } = props;

    return <div className={styles.header}>
        <div className={styles.left}>
            <ControlCenter>
                <div className={styles.actionButton}>
                    <Icon type={"apps"} />
                </div>
            </ControlCenter>
            <SearchBar />
        </div>
        <div className={styles.right}>
            <div onClick={()=>{
                main.current.openWindow({
                    id: "setting",
                    type: "system",
                    title: "设置",
                    width: 500,
                    height: 600,
                    icon: {
                        title: "设置",
                        type: 'image',
                        image: '/assets/image/system/setting.png',
                        color: '#2862FF'
                    }
                })
            }} className={styles.actionButton}>
                <Icon type={"setting"} />
            </div>
            <div onClick={()=>{
                main.current.openWindow({
                    id: "login",
                    type: "system",
                    title: "登录",
                    width: 350,
                    height: 350,
                    titleBar: false,
                    // resizable: false,
                    dragHandle: '.arco-tabs-header-nav',
                    icon: {
                        title: "设置",
                        type: 'image',
                        image: '/assets/image/system/login.png',
                        color: '#3E3EEE'
                    }
                })
            }} className={styles.actionButton}>
                <Icon type={"user"} />
            </div>
        </div>
    </div>
}

export default Header;
