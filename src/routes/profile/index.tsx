import { FunctionalComponent, h } from 'preact';
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';
import style from './style.css';
import {route} from "preact-router";
import InvestForm from "../../components/investForm";
import {Button} from "@waves/provider-ledger/dist/ui/ui-kit";

interface Props {
    store: any
}

const Profile: FunctionalComponent<Props> = ({ store }: Props) => {
    const [time, setTime] = useState<number>(Date.now());
    useEffect(() => {
        const timer = window.setInterval(() => {
            setTime(Date.now());
            store.updateUserData();
        }, 20000);
        return (): void => clearInterval(timer);
    }, [store.updateUserData]);

    useEffect(() => {
        if (!store.user) {
            route('/login');
        }
    }, [store.user])

    const deposit = useCallback((amount?: number, interval?: number) => {
        store.investTx(amount, interval);
    }, [store.investTx]);

    const stopInvest = useCallback(() => {
        store.stopInvestTx();
    }, [store.stopInvestTx]);

    const claim = useCallback(() => {
        store.claimTx();
    }, [store.claimTx]);

    const minInterval = useMemo(() => {
        return Math.ceil(store.userData.remainingTime / 30 * 24 * 60);
    }, [store.userData.remainingTime])

    return (
        <div class={style.profile}>
            <h1>My invest</h1>

            <div>
                Balance: {store.userData.balance / (10 ** 6)} CLRC
            </div>
            <div>
                Invested: {store.userData.invested / (10 ** 6)} CLRC
            </div>
            <div>
                My APY: {Math.ceil(store.userData.apy / 10 ** 4) / 100}%
            </div>
            <div>
                End invest: { Math.round(store.userData.remainingTime / 60 / 24)} days
            </div>
            <div>
                To Claim: {store.userData.toClaim / (10 ** 6)} CLRC
                {store.userData.toClaim ? <button onClick={claim}>Claim reword</button> : null}
            </div>
            <div>
                <div>
                    <InvestForm store={store} isInvest={true} onClick={deposit} minInterval={minInterval}/>
                </div>
            </div>
            <div>
                {store.userData?.invested && store.userData?.remainingTime && (
                    <div>
                        <div>
                        Return you deposit with forfeit {(store.userData.invested - store.userData?.forfeit) / 10 ** 6} CLRC
                        </div>
                        <div>
                            <button onClick={stopInvest}>Return Deposit</button>
                        </div>
                    </div>
                ) || ''}
                {store.userData?.invested && !store.userData?.remainingTime && (
                    <div>
                        <div>Return you deposit {store.userData.invested / 10 ** 6 } CLRC</div>
                        <div>
                            <button onClick={stopInvest}>Return Deposit</button>
                        </div>
                    </div>
                ) || ''}
            </div>
        </div>
    );
};

export default Profile;
