import { Signer } from '@waves/signer';
import {useCallback, useEffect, useState} from "preact/hooks";

let ProviderLedger: any;
let ProviderKeeper: any;
let ProviderCloud: any;
let ProviderWeb: any;


let PROVIDERS = {
    LEDGER: ProviderLedger,
    KEEPER: ProviderKeeper,
    MAIL: ProviderCloud,
    WX: ProviderWeb
};

if (typeof window !== "undefined")  {
    ProviderLedger = require('@waves/provider-ledger').ProviderLedger;
    ProviderKeeper = require('@waves/provider-keeper').ProviderKeeper;
    ProviderCloud = require('@waves.exchange/provider-cloud').ProviderCloud;
    ProviderWeb = require('@waves.exchange/provider-web').ProviderWeb;

    PROVIDERS.LEDGER = ProviderLedger;
    PROVIDERS.KEEPER = ProviderKeeper;
    PROVIDERS.MAIL = ProviderCloud;
    PROVIDERS.WX = ProviderWeb;
}

export const useSigner = (settings: { NODE: string }) => {

    const [signer, setSigner] = useState<Signer | null>(null);

    useEffect(() => {
        setSigner(new Signer({NODE_URL: settings.NODE}))
    }, [settings.NODE]);

    const selectProvider = useCallback(async (provider: keyof typeof PROVIDERS) => {
        if (!PROVIDERS[provider] || !signer) {
            return false;
        }

        await signer.setProvider(new PROVIDERS[provider]);
        return true;
    }, [signer]);

    return {
        signer,
        selectProvider
    }
};