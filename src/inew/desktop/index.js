import styles from './index.scss';
import Clock from "inew-plugin-core/clock";
import { useEffect, useMemo, useRef } from "react";
import DesktopIcon from "./icon";
import Sortable from 'sortablejs';
import React from "react";

const Desktop = (props) => {
    const {
        main,
        apps = []
    } = props;

    const appsRef = useRef();

    const desktopIcons = useMemo(() => {
        return apps.map((props) => {
            return <DesktopIcon main={main} key={props.id} {...props}/>
        })
    }, [apps, main]);

    useEffect(() => {
        Sortable.create(appsRef.current, {
            animation: 200,
        });
    }, [])

    return <div className={styles.desktop}>
        <div className={styles.clock}>
            <Clock />
        </div>
        <div className={styles.apps}>
            <div className={styles.appIcons} ref={appsRef}>
                { desktopIcons }
            </div>
        </div>
    </div>
};

export default Desktop;
