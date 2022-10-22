import { Dropdown, Tabs } from "@arco-design/web-react";
import styles from './index.scss';
const TabPane = Tabs.TabPane;
import React from "react";

const ControlCenterPanel = () => {
    return <div className={styles.controlCenter}>
        <Tabs defaultActiveTab='favorite'>
            <TabPane key='favorite' title='收藏夹'>
                收藏夹
            </TabPane>
            <TabPane key='todo' title='待办事项'>
                待办事项
            </TabPane>
            <TabPane key='appstore' title='应用市场'>
                应用市场
            </TabPane>
        </Tabs>
    </div>
}

const ControlCenter = (props) => {
    const { children } = props;
    const panel = <ControlCenterPanel />
    return <Dropdown droplist={panel} trigger={"click"} position='bl'>
        { children }
    </Dropdown>
};

export default ControlCenter;
