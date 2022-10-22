import styles from './index.scss';
import { Tooltip } from "@arco-design/web-react";
import React from "react";

const TaskIcon = (props) => {
    const {
        className = '',
        type = "text",
        image = "",
        text = "",
        color = "white",
        title = ""
    } = props;

    const names = [styles.taskIcon];
    if(className) names.push(className);

    let iconObject = null;

    if(type === "image") {
        iconObject = <div
            style={{backgroundImage: `url(${image})`}}
            className={styles.image}
        />
    }

    return <Tooltip mini content={title}>
        <div
            style={{backgroundColor: color}}
            className={names.join(' ')}
        >
            { iconObject }
        </div>
    </Tooltip>;
};

export default TaskIcon;
