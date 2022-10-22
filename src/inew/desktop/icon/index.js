import styles from './index.scss';
import {useCallback, useMemo} from "react";
import React from "react";

const DesktopIcon = (props) => {
    const {
        id = Date.now(),
        size = "1x1",
        color = null,
        title = "",
        type = "image",
        triggerType = "url",
        url = "",
        image = "",
        main
    } = props;
    const win = useMemo(() => props.window || {}, [props.window]);

    const className = [styles.icon];
    className.push(`size-${size}`);

    let iconObject = null;
    if(type === "image") {
        iconObject = <div
            style={{backgroundImage: `url(${image})`}}
            className={styles.image}
        />
    }else if(type === "widget"){
        // const Widget = SystemWidgets[id];
        iconObject = <></> // <Widget />;
    }

    const onClick = useCallback(() => {
        if(triggerType === "url") {
            window.open(url);
        }else if(triggerType === "window") {
            main.current.openWindow({
                ...win,
                id,
                title,
                icon: {
                    type: "image", color, title, image
                }
            });
        }
    }, [color, id, image, main, title, triggerType, url, win])

    return <div
        onClick={onClick}
        className={className.join(' ')}
    >
        <div className={styles.iconInner}>
            <div
                style={{backgroundColor: color}}
                className={styles.iconContainer}
            >
                { iconObject }
            </div>
            <div className={styles.title}>
                { title }
            </div>
        </div>
    </div>
};

export default DesktopIcon;
