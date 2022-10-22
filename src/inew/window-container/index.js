import {forwardRef, useImperativeHandle, useRef, useState, useCallback, useEffect, createRef} from "react";
import _ from "lodash";
import Window from "../window";
import React from "react";

const WindowContainer = (props, ref) => {
    const {
        onMinimized = ((e)=>{}), // 窗口最小化回调
        onClose = ((e)=>{}), // 窗口关闭回调
        onOpen = ((e)=>{}), // 窗口打开回调
        onTop = ((e)=>{}) // 窗口到顶部回调
    } = props;

    const [windows, setWindows] = useState([]);
    const windowRefs = useRef({});
    const [openId, setOpenId] = useState('');

    const openWindowById = useCallback((id, focus = false) => {
        const win = windowRefs.current[id];
        if(win.isMinimized()) {
            if(focus) {
                win.restore();
            }
            return;
        }
        win.open();
    }, [])

    const open = useCallback((setting) => {
        const win = windows.find(({id}) => (id === setting.id));
        if(win) {
            openWindowById(win.id, true);
        }else{
            windows.push(setting);
            setOpenId(setting.id);
            setWindows(_.cloneDeep(windows));
        }
    }, [openWindowById, windows]);

    const close = useCallback((id) => {
        windowRefs.current[id] = null;
        const newWindows = [];
        windows.forEach((win) => {
            if(win.id !== id) {
                newWindows.push(win);
            }
        });
        setWindows(newWindows);
    }, [windowRefs, windows])

    const refs = useCallback(() => {
        const refs = [];
        Object.keys(windowRefs.current).forEach((key) => {
            if(windowRefs.current[key]) refs.push(windowRefs.current[key]);
        })
        return refs;
    }, [])

    const windowObjects = windows.map((setting) => {
        return <Window
            key={setting.id}
            {...setting}
            refContainer={ref}
            onClose={() => {
                close(setting.id);
                onClose(setting.id);
            }}
            onOpen={(i) => {
                onOpen(windows.find(({id})=>(id === i)));
            }}
            onMinimized={onMinimized}
            ref={createRef()}
            onTop={onTop}
        />
    });

    useEffect(() => {
        windowObjects.forEach((obj)=>{
            const { ref, props } = obj;
            windowRefs.current[props.id] = ref.current;
            if(props.id === openId) {
                openWindowById(props.id);
                setOpenId('');
            }
        })
    }, [openId, openWindowById, windowObjects]);

    const getTopRef = useCallback(() => {
        let top = null;
        let topIndex = 0;
        refs().forEach((r) => {
            if(r.index() >= topIndex && !r.isMinimized()) {
                top = r;
                topIndex = r.index();
            }
        })
        return top;
    }, [refs]);

    const toTop = useCallback((id) => {
        refs().forEach((r) => {
            r.setTop(r.id() === id);
        })
    }, [refs])

    useImperativeHandle(ref, () => ({
        open,
        close,
        refs,
        getTopRef,
        toTop,
        isTop: (id) => {
            const top = getTopRef();
            if(top == null) return true;
            return top.id() === id;
        },
        getRef: (id) => {
            return windowRefs.current[id] || null;
        }
    }));

    return <>
        { windowObjects }
    </>
}

export default forwardRef(WindowContainer);
