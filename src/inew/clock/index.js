import styles from './index.scss';
import {useEffect, useState} from "react";
import chineseLunar from 'chinese-lunar';
import dayjs from "dayjs";
import React from "react";
import ReactDigitalNumeric from '@feizheng/react-digital-numeric';

const TIME_FORMAT = "HH:mm:ss";

const Clock = () => {
    const [lunar, setLunar] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(dayjs().format(TIME_FORMAT));

    useEffect(() => {
        setLunar(chineseLunar.format(chineseLunar.solarToLunar(new Date()), 'MD'));
        setDate(dayjs().format('YYYY/MM/DD'))
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(dayjs().format("HH:mm:ss"));
        }, 1000)
        return () => {
            clearInterval(timer);
        }
    }, [])

    return <div className={styles.clock}>
        <div className={styles.time}>
            <ReactDigitalNumeric value={time} flat={true} />
        </div>
        <div className={styles.date}>
            { date } { lunar }
        </div>
    </div>
};

export default Clock;
