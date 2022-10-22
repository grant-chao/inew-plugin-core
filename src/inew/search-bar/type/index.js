import { Dropdown, Menu } from "@arco-design/web-react";
import styles from './index.scss';
import types from '@/config/search.engines';
import Icon from "@/components/icon";
import React from "react";

const SearchType = (props) => {
    const { value = "baidu", onChange = ((v) => (v)), onVisibleChange, onClick = (() => {}) } = props;

    const dropList = (
        <Menu
            onClickMenuItem={(v)=>{
                onChange(v);
                onClick();
            }}
            className={styles.menus}
        >
            <Menu.ItemGroup title={"搜索引擎"}>
                {
                    types.map((type) => {
                        return <Menu.Item key={type.id}>
                            <div className={styles.item}>
                                <div className={[styles.icon, "type-" + type.id].join(" ")} />
                                <div className={styles.title}>{ type.title }</div>
                            </div>
                        </Menu.Item>
                    })
                }
            </Menu.ItemGroup>
        </Menu>
    );

    const current = types.find(({id})=>(id === value)) || types[0];

    return <Dropdown onVisibleChange={(v)=>{
        onVisibleChange(v);
        if(v) onClick();
    }} droplist={dropList} trigger='click' position='br'>
        <div className={styles.type}>
            <Icon type={current.id} />
            <Icon type={"down"} />
        </div>
    </Dropdown>
};

export default SearchType;
