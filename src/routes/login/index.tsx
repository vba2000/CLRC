import { FunctionalComponent, h } from 'preact';
import {useCallback, useEffect, useState} from 'preact/hooks';
import style from './style.css';


type Props = {
    selectProvider: (type: any) => Promise<any>;
};


const Login: FunctionalComponent<Props> = ({ selectProvider }) => {

    const selectLedger = useCallback(() => selectProvider('LEDGER'), [selectProvider]);
    const selectMail = useCallback(() => selectProvider('MAIL'), [selectProvider]);
    const selectWX = useCallback(() => selectProvider('WX'), [selectProvider]);
    const selectKeeper = useCallback(() => selectProvider('KEEPER'), [selectProvider]);

    return (
        <div class={style.profile}>
            <h1>Login</h1>
            <p>Select login type</p>

            <p>
                <button onClick={selectKeeper}>Waves keeper</button>
                <button onClick={selectMail}>Email</button>
                <button onClick={selectWX}>Waves.exchange</button>
                <button onClick={selectLedger}>Ledger</button>
            </p>
        </div>
    );
};

export default Login;
