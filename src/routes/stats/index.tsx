import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import {useCallback, useEffect, useMemo, useState} from "preact/hooks";

type Props = {
    store: any
};


const StatsItem: FunctionalComponent<{stats: string, height: number}>  = ({ stats, height }) => {

    const data = stats.split('__');
    const invested = Number(data[4]) / 10 ** 6;
    const totalTime = Number(data[2]) - Number(data[1]);
    let remainingTime = Number(data[2]) - height;
    remainingTime = remainingTime > 0 ? remainingTime : 0;
    const claimed = Number(data[6]) / 10 ** 6;
    const apy = Number(data[7]) / 10 ** 6;

    return <p>
        <div>{invested} CLRC</div>
        <div>Total lock: {Math.round(totalTime / 60 / 24)} d</div>
        <div>Remainig lock: {Math.round(remainingTime / 60 / 24)} d</div>
        <div>Claimed: {claimed} CLRC</div>
        <div>Apy: {apy} %</div>
    </p>;
};

const Stats: FunctionalComponent<Props> = ({ store }) => {
    const [time, setTime] = useState<number>(Date.now());
    useEffect(() => {
        const timer = window.setInterval(() => {
            setTime(Date.now());
            store.updateUserData();
        }, 20000);
        return (): void => clearInterval(timer);
    }, [store.updateUserData]);

    const stats =  useMemo(() => {
        return store.userData?.stats || [];
    }, [store.userData]);

    return (
        <div class={style.home}>
            <h1>CLRC Stats</h1>
            { stats.map((v: string) => <StatsItem stats={v} height={store.userData.height}/>) }
        </div>
    );
};

export default Stats;
