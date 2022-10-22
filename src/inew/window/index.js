import styles from './index.scss';
import Draggable from "react-draggable";
import {Resizable} from "react-resizable";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import Icon from "@/components/icon";
import {isMac} from "../utils";
import {Z_INDEX} from "@/config/window";
import { Spin } from "@arco-design/web-react";
import React from "react";

let current_index = Z_INDEX;

const Window = (props, ref) => {
    const {
        id = Date.now(),
        defaultIndex = Z_INDEX,
        type = "system", // 窗口类型，字典：system-系统内置、url-加载地址、app-第三方应用
        width = 600, // 初始宽度
        height = 400, // 初始高度
        minWidth = 150, // 最小宽度
        minHeight = 150, // 最小高度
        resizable = true, // 是否允许缩放
        draggable = true, // 是否允许拖拽
        titleBar = true, // 是否显示标题栏
        title = "", // 标题
        url = "", // 加载地址
        dragHandle = "" , // 触发拖动的区域
        refContainer = null, // 所在容器
        onMinimized = ((e)=>{}), // 窗口最小化回调
        onMaximized = ((e)=>{}), // 窗口最大化回调
        onClose = ((e)=>{}), // 窗口关闭回调
        onOpen = ((e)=>{}), // 窗口打开回调
        onTop = ((e)=>{}) // 窗口到顶部回调
    } = props;

    const domRef = useRef();

    const [containerWidth, setContainerWidth] = useState(width);
    const [containerHeight, setContainerHeight] = useState(height);
    const [visible, setVisible] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [maximized, setMaximized] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [zIndex, setZIndex] = useState(defaultIndex);
    const maximizedRef = useRef(false);
    const minimizedRef = useRef(false);
    const indexRef = useRef(defaultIndex);
    const [inTop, setInTop] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [loading, setLoading] = useState(type === "url");
    const [loaded, setLoaded] = useState(type !== "url");

    useEffect(() => {
        indexRef.current = zIndex;
    }, [zIndex])

    useEffect(() => {
        if(inTop) onTop(id);
    }, [id, inTop, onTop])

    const close = () => {
        setVisible(false);
        onClose(id);
    }

    const toTop = useCallback(() => {
        current_index += 1;
        setZIndex(current_index);
        if(!refContainer || !refContainer.current) return;
        refContainer.current.toTop(id);
    },[id, refContainer]);

    const center = useCallback(() => {
        const mainSize = getMainSize();
        setX((mainSize.width - containerWidth) / 2)
        setY((mainSize.height - containerHeight) / 2)
    }, [containerHeight, containerWidth])

    // 打开窗口
    const open = useCallback(() => {
        if(!visible) {
            center();
            onOpen(id);
            setVisible(true);
        }
        if(!minimized) {
            toTop();
        }
    },[center, id, minimized, onOpen, toTop, visible]);

    const maximize = useCallback(() => {
        setMaximized(true);
    }, [])

    useEffect(() => {
        maximizedRef.current = maximized;
        if(maximized) {
            onMaximized(id);
        }
    }, [id, onMaximized, maximized])

    const restore = useCallback(() => {
        if(minimizedRef.current) {
            toTop();
            onTop(id);
            setMinimized(false);
            return;
        }
        if(maximizedRef.current) {
            setMaximized(false);
        }
    }, [id, onTop, toTop])

    const minimize = useCallback(() => {
        setMinimized(true);
    }, []);

    const setTop = useCallback((t) => {
        setInTop(t)
    }, []);

    useEffect(() => {
        minimizedRef.current = minimized;
        if(minimized) {
            onMinimized(id);
        }
    }, [onMinimized, id, minimized])

    // 公共接口
    useImperativeHandle(ref, ()=>({
        id: () => (id), // 窗口句柄
        height: (h) => {
            if(h) {
                setContainerHeight(h);
            }else{
                return containerHeight;
            }
        },
        open, // 打开窗口
        center, // 使窗口居中
        setTop,
        index: () => indexRef.current, // 当前zIndex
        toTop, // 窗口置顶
        maximize, // 窗口最大化
        isMaximized: () => maximizedRef.current, // 是否是最大化
        minimize, // 最小化
        isMinimized: () => minimizedRef.current, // 是否是最小化
        restore // 还原窗口最大化/最小化前的尺寸和状态
    }), [center, containerHeight, id, maximize, minimize, open, restore, setTop, toTop])

    const getMainSize = () => {
        const width = domRef.current.parentNode.clientWidth;
        const height = domRef.current.parentNode.clientHeight;
        return {
            width,
            height
        }
    }

    const onResize = useCallback((event, {size}) => {
        setContainerWidth(size.width);
        setContainerHeight(size.height);
    }, [])

    const onDrag = useCallback((event, data) => {
        if(maximized) return;
        setX(data.x);
        setY(data.y);
    }, [maximized])

    const onDragStart = useCallback((event, data) => {
        toTop();
    }, [toTop])

    const onResizeStart = useCallback((event, data) => {
        toTop();
        setResizing(true);
    }, [toTop])

    const onResizeStop = useCallback(() => {
        setResizing(false);
    }, [])

    const className = [styles.window];
    if(visible) className.push(styles.show);
    if(titleBar) className.push(styles.showTitleBar)
    if(isMac()) className.push(styles.isMac);
    if(inTop) className.push(styles.active);
    if(maximized) className.push(styles.maximized);
    if(minimized) className.push(styles.minimized);
    if(resizing) className.push(styles.resizing);
    if(loading) className.push(styles.loading);
    if(loaded) className.push(styles.loaded);

    const controlButtons = [
        { id: "close", onClick: close, className: styles.close },
        { id: "min", onClick: minimize, className: styles.min },
        { id: "max", onClick: maximize, className: styles.max },
        { id: "re", onClick: restore, className: styles.re }
    ].map((button)=>{
        const { id, className, onClick } = button;
        if(maximized) {
            if( id === "max" ) return null;
        }else {
            if( id === "re" ) return null;
        }
        if(!resizable) {
            if(['max', 'ref'].includes(id)) return null;
        }
        return <div key={id} onClick={onClick} className={[styles.controlButton, className].join(' ')}>
            <Icon type={id} />
        </div>
    })

    const body = useMemo(() => {
        let Object = null;
        if(type === "system") {
            Object = null// SystemApps[id];
        }else if(type === "url") {
            return <iframe src={url} onLoad={() => {
                setTimeout(() => {
                    setLoading(false);
                    setTimeout(() => setLoaded(true), 200);
                }, 500)
            }} />
        }
        if(Object == null) return ;
        return <Object windowRef={ref} />
    }, [id, ref, type, url])

    const container = <div
        onClick={toTop}
        ref={domRef}
        className={className.join(' ')}
        style={{height: containerHeight, width: containerWidth, zIndex}}
    >
        <div className={styles.titleBar}>
            { title }
        </div>
        <div className={styles.windowControl}>
            { controlButtons }
        </div>
        <div className={styles.body}>
            { body }
        </div>
        <div className={styles.bodyMask} />
        <div className={styles.loadingMask}>
            <Spin />
        </div>
    </div>;

    const resizableContainer = resizable ? <Resizable
        width={containerWidth}
        height={containerHeight}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
    >
        { container }
    </Resizable>: container

    const dragHandles = [];
    if(dragHandle) dragHandles.push(dragHandle);
    dragHandles.push(`.${styles.titleBar}`);
    dragHandles.push(`.${styles.windowControl}`);

    return draggable ? <Draggable
        position={{x, y}}
        handle={dragHandles.join(',')}
        onDrag={onDrag}
        onStart={onDragStart}
    >
        { resizableContainer }
    </Draggable> : resizableContainer;
}

export default forwardRef(Window);
