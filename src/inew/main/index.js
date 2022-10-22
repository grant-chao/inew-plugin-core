import styles from './index.scss';
import Header from "inew-plugin-core/header";
import {forwardRef, useImperativeHandle, useRef} from "react";
import TaskBar from "inew-plugin-core/task-bar";
import Desktop from "inew-plugin-core/desktop";
import WindowContainer from "inew-plugin-core/window-container";
import React from "react";

const Main = (props, ref) => {
    const {
        apps = [],
        searchEngines = []
    } = props;
    const taskBarRef = useRef();
    const windowContainerRef = useRef();

    useImperativeHandle(ref, () => ({
        openWindow:(setting)=> {
            const container = windowContainerRef.current;
            container.open(setting);
        },
        closeWindow: (id)=> windowContainerRef.current.close(id)
    }));

    return <div className={styles.main}>
        <Header main={ref} />
        <WindowContainer
            onOpen={(setting) => {
                const container = windowContainerRef.current;
                const winRef = container.getRef(setting.id);
                taskBarRef.current.add(setting, winRef);
            }}
            onTop={(id) => {
                taskBarRef.current.active(id);
            }}
            onClose={(id) => {
                taskBarRef.current.remove(id);
                const container = windowContainerRef.current;
                const top = container.getTopRef();
                if(top) {
                    taskBarRef.current.active(top.id());
                }
            }}
            onMinimized={(id) => {
                const container = windowContainerRef.current;
                const top = container.getTopRef();
                taskBarRef.current.inactive(id);
                if(top) {
                    taskBarRef.current.active(top.id());
                }
            }}
            ref={windowContainerRef}
        />
        <Desktop
            main={ref}
            apps={apps}
        />
        <TaskBar
            onClick={(id)=>{
                const container = windowContainerRef.current;
                const winRef = container.getRef(id);
                if(!winRef) return;
                if(winRef.isMinimized()) {
                    winRef.restore();
                    return;
                }
                if(container.isTop(id)) {
                    winRef.minimize();
                }else{
                    winRef.toTop();
                }
            }}
            ref={taskBarRef}
        />
    </div>
}

export default forwardRef(Main);
