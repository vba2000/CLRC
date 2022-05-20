import {use} from "i18next";
import {Signer} from "@waves/signer";


export type UserData = {
    balance: number;
    invested: number;
    totalTime: number;
    remainingTime: number;
    toClaim: number;
    claimed: number;
    forfeit: number;
}

export const getUserData = async (nodeUrl: string, user: string, dapp: string, setUserData: (d: UserData) => void, signer: Signer|null) => {


    user = user || 'Unknown';
    const { height } = await fetch(`${nodeUrl}blocks/height`).then(res => {
        if (res.status === 200) {
            return res.json();
        }
        throw new Error('Can\'t fetch user data');
    });

    const res = await fetch(`${nodeUrl}addresses/data/${dapp}`).then(res => {
        if (res.status === 200) {
            return res.json();
        }
        throw new Error('Can\'t fetch user data');
    });

    const data = res.reduce((acc: any, item: any) => {
        switch (true) {
            case item.key.includes(user):
                const data = item.value.split('__');
                acc.invested = Number(data[4]);
                acc.totalTime = Number(data[2]) - Number(data[1]);
                acc.remainingTime = Number(data[2]) - height;
                acc.remainingTime = acc.remainingTime > 0 ? acc.remainingTime : 0;
                acc.height = height;
                acc.notClaimed = Number(data[5]);
                acc.claimed = Number(data[6]);
                acc.apy = Number(data[7]);
                break;
            case '%s__maxInterval' === item.key:
                acc.maxInterval = item.value;
                break;
            case '%s__totalInvest' === item.key:
                acc.totalInvested = item.value;
                break;
            case '%s__maxInvest' === item.key:
                acc.maxInvest = item.value;
                break;
            case '%s__apyFrom' === item.key:
                acc.apyFrom = item.value;
                break;
            case '%s__apyTo' === item.key:
                acc.apyTo = item.value;
                break;
            case '%s__investAssetId' === item.key:
                acc.assetId = item.value;
                break;
        }

        return acc;
    }, {
        totalTime: 0,
        remainingTime: 0,
        amount: 0,
        claimed: 0,
        notClaimed: 0
    });

    let balance = 0;
    let toClaim = 0;
    let forfeit = 0;
    if (user !== 'Unknown' && data.assetId) {
        const balances = await signer?.getBalance();
        const asset = (balances || []).find(item => {
                return item.assetId === data.assetId;
        }) || {} as any;

        balance = asset.amount ? asset.amount : 0;
        const toClaimInBlock = data.invested * data.apy / (365 * 24 * 60) / (10 ** 8);
        const allRewords =  Math.ceil( (data.totalTime - data.remainingTime) * toClaimInBlock);
        toClaim = (allRewords - data.claimed + + data.notClaimed) || 0;
        forfeit = Math.ceil(toClaimInBlock * data.totalTime) * 2 - allRewords + toClaim;
    }

    const total =  {
        balance,
        forfeit,
        invested: 0,
        totalTime: 0,
        remainingTime: 0,
        toClaim,
        claimed: 0,
        ...data
    };

    setUserData(total);
}