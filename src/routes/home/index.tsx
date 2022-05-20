import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import {useCallback, useEffect, useState} from "preact/hooks";
import {route} from "preact-router";
import InvestForm from "../../components/investForm";

type Props = {
    store: any
};

const Home: FunctionalComponent<Props> = ({ store }) => {
    const [time, setTime] = useState<number>(Date.now());
    useEffect(() => {
        const timer = window.setInterval(() => {
            setTime(Date.now());
            store.updateUserData();
        }, 20000);
        return (): void => clearInterval(timer);
    }, [store.updateUserData]);


    const toInvest = useCallback(() => route('/invest'), []);

    return (
        <div class={style.home}>
            <h1>CLRC Invest</h1>
            <p>The best invest product</p>

            <div>
                <h2>Content</h2>
                <p>
                    APY from: {store.userData?.apyFrom}%
                </p>
                <p>
                    APY to: {store.userData?.apyTo}%
                </p>
                <p>
                    Max invest: {(store.userData?.maxInvest / 10 ** 6) || 0} CLRC
                </p>
                <p>
                    Invested: {(store.userData?.totalInvested / 10 ** 6) || 0} CLRC
                </p>
                <p>
                    Remain Invest: {((store.userData?.maxInvest - store.userData?.totalInvested) / 10 ** 6) || 0} CLRC
                </p>
                <p>
                    Max lock period: {store.userData?.maxInterval} months
                </p>
            </div>

            <div>
                <InvestForm store={store} isInvest={false} onClick={toInvest}/>
            </div>
        </div>
    );
};

export default Home;
