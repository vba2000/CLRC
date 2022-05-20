import {useCallback, useEffect, useState} from 'preact/hooks';
import { UserData, getUserData } from './getUserData';
import {useSigner} from "./signer";
import {route} from "preact-router";
import {claim, deposit, stopInvest} from "./nodeInteractions";


interface Settings {
    NODE: string;
    DAPP: string;
    CLRC_ID: string;
    NETWORK: string;
}



export const useStore = ({ NODE, DAPP, CLRC_ID }: Settings) => {
    const [user, setUser] = useState('');
    const [publicKey, setPk] = useState('');
    const [userData, setUserData] = useState({} as UserData);
    const {signer, selectProvider  } = useSigner({ NODE });
    const [isLoading, setIsLoading] = useState(false);

    const updateUserData = useCallback(() => {
        setIsLoading(true);
        getUserData(NODE, user, DAPP, setUserData, signer)
            .catch(e => e)
            .then(() =>  setIsLoading(false));
    }, [user, signer]);

    useEffect(() => {
        setIsLoading(true);
        getUserData(NODE, user, DAPP, setUserData, signer)
            .catch(e => e)
            .then(() =>  setIsLoading(false));
    }, [user]);

    const selectProviderAndLogin = useCallback(async (adapter: any) => {
        try {
            const res = await selectProvider(adapter);
            if (res && signer) {
                const userData = await signer.login();
                setUser(userData.address);
                setPk(userData.publicKey);
                route('/invest');
                return true;
            }
        } catch (e) {

        }
        return false;
    }, [selectProvider])


    const claimTx = useCallback(() => {
        if (!user) {
            return Promise.reject('No user');
        }
        return signer?.invoke(claim(user, DAPP)).broadcast().then(() => {updateUserData()});
    },[signer, user]);


    const investTx = useCallback((amount: number, interval: number) => {
        if (!user) {
            return Promise.reject('No user');
        }
        amount = Math.ceil(amount * 10 ** 6);
        return signer?.invoke(deposit(user, DAPP, amount, CLRC_ID, interval)).broadcast().then(() => {updateUserData()});
    },[signer, user]);

    const stopInvestTx = useCallback(() => {
        if (!user) {
            return Promise.reject('No user');
        }
        return signer?.invoke(stopInvest(user, DAPP)).broadcast().then(() => {updateUserData()});
    },[signer, user]);

    return {
        user,
        setUser,
        isLoading,
        userData,
        updateUserData,
        selectProvider: selectProviderAndLogin,
        tokenId: CLRC_ID,
        claimTx,
        investTx,
        stopInvestTx
    };
}