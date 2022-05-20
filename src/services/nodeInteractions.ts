

type Payment = {
    amount: number;
    assetId: string;
};

type DataType = { type: "string"; value: string } |  { type: "integer"; value: number };

export const createInvoke = (userAddress: string, dapp: string, func: string, payments: Array<Payment> = [], args: Array<DataType> = []) => {
    return {
        "type": 16,
        "sender": userAddress,
        "feeAssetId": null,
        "timestamp": Date.now(),
        "version": 1,
        "dApp": dapp,
        "payment": [...payments],
        "call": {
            "function": func,
            "args": [...args]
        }
    };
};

export const deposit = (userAddress: string, dapp: string, amount: number, assetId: string, interval: number) => {
    return createInvoke(userAddress, dapp, 'deposit', [{ amount, assetId }], [{ type: 'integer', value: interval }]);
};

export const claim = (userAddress: string, dapp: string,) => {
    return createInvoke(userAddress, dapp, 'claim', [], []);
};

export const stopInvest = (userAddress: string, dapp: string,) => {
    return createInvoke(userAddress, dapp, 'cancelInvest', [], []);
};
