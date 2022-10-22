import styles from './index.scss';
import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import _ from 'lodash';
import TaskIcon from "./icon";
import React from "react";

const TaskBar = (props, ref) => {
    const {
        onClick = ((e)=>{})
    } = props;

    const [tasks, setTasks] = useState([]);
    const [active, setActive] = useState('');

    const add = useCallback((setting, ref) => {
        tasks.push({
            ...setting,
            ref
        });
        setTasks(_.cloneDeep(tasks));
        setActive(setting.id);
    }, [tasks]);

    const remove = useCallback((id) => {
        const list = [];
        tasks.forEach((item) => {
            if(item.id !== id) {
                list.push(item);
            }
        });
        setTasks(list);
    }, [tasks]);

    useImperativeHandle(ref, () => ({
        add,
        active: (id) => {
            setActive(id);
        },
        remove,
        inactive: (id) => {
            if(id === active) {
                setActive('');
            }
        }
    }));

    const taskIcons = tasks.map((task) => {
        const className = [styles.item];
        if(active === task.id) className.push(styles.active);
        return <div
            onClick={() => onClick(task.id)}
            key={task.id}
            className={className.join(' ')}
        >
            <TaskIcon className={styles.taskIcon} {...task.icon} />
            <div className={styles.status} />
        </div>
    })

    const className = [styles.taskBar];
    if(!taskIcons.length) className.push(styles.hide);

    return <div className={className.join(' ')}>
        { taskIcons }
    </div>
};

export default forwardRef(TaskBar);
