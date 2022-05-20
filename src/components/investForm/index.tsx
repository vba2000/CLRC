import {FunctionalComponent, h} from 'preact';
import style from './style.css';
import {useCallback, useState} from "preact/hooks";

type Props = {
    store: any;
    isInvest: boolean;
    minInterval: number;
    onClick: (amount?: number, interval?: number) => any;
};

const validateInterval = (remainingTime: number = 0, interval: number = 0) => {
    return remainingTime > interval * 30 * 24 * 60 || !interval ? 'Wrong interval' : null;
};

const validateAmount = (amount: number, maxInvest: number, balance: number) => {
    switch (true) {
        case amount <= 0:
            return 'Wrong amount';
        case amount > maxInvest:
            return `Deposit can be smaller than ${maxInvest} CLRC`;
        case amount > balance:
            return 'Deposit is more than balance';
        default:
            return null;
    }

}


const InvestForm: FunctionalComponent<Props> = (props) => {

    const { store, isInvest } = props;

    const [amount, setAmount] = useState(0);
    const [apy, setApy] = useState(0);
    const [monthes, setMonthes] = useState(0);
    const [amountError, setAmountError] = useState<null|string>(null);
    const [intervalError, setIntervalError] = useState<null|string>(null);

    const [showIntervalError, setShowIntervalError] = useState(false);
    const [showAmountError, setShowAmountError] = useState(false);

    const calculateApy = useCallback((e: any) => {
        const from = store.userData?.apyFrom || 0;
        const to = store.userData?.apyTo || 0;
        const maxInterval = store.userData?.maxInterval || 0;
        const month = Number(e.target.value) || 0;
        setMonthes(month);
        const apy = month ? (to - from) / (maxInterval - 1) * (month - 1) + from : 0;
        setApy(apy);
    }, [store.userData]);

    const changeAmount = useCallback((e: any) => {
        const newAmount = Number(e.target.value) || 0;
        if (amount === newAmount) {
            return;
        }
        setAmount(newAmount);
    }, [amount]);

    const handleClick = useCallback(() => {
        const maxDeposit = ((store.userData?.maxInvest - store.userData?.totalInvested) / 10 ** 6) || 0;
        const balance = store.userData.balance / (10 ** 6);
        const intervalError = validateInterval(store.userData?.remainingTime, monthes);
        const amountError = validateAmount(amount, maxDeposit, balance);

        if (amountError || intervalError && isInvest) {
            setAmountError(amountError);
            setShowAmountError(!!amountError);
            setIntervalError(intervalError);
            setShowIntervalError(!!intervalError);
            return;
        }

        setShowAmountError(false);
        setShowIntervalError(false);
        props.onClick(amount, monthes);
    }, [amount, monthes, isInvest]);

    return (
        <div className={style.form}>
            <div>
                <input value={amount} onInput={changeAmount} type="number"/>
                <div className={style.error}>{ showAmountError ? amountError : ''}</div>
            </div>
            <div>
                <input
                    type="range"
                    min={"0"} max="6"
                    value={monthes}
                    onInput={calculateApy}
                    step="1"
                />
                <div className={style.error}>{ showIntervalError ? intervalError : ''}</div>
            </div>
            <div>
                Month: {monthes}
            </div>
            <div>
                Apy: {apy}%
            </div>
            <div>
                Profit: { Math.ceil(apy * amount * monthes / 12) / 100  } CLRC
            </div>
            <div>
                <button onClick={handleClick}>INVEST</button>
            </div>
        </div>
    );
};

export default InvestForm;
