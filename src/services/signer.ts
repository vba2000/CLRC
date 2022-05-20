import { Signer } from '@waves/signer';
import { ProviderLedger } from '@waves/provider-ledger';
import { ProviderKeeper } from '@waves/provider-keeper';
import { ProviderCloud } from '@waves.exchange/provider-cloud';
import { ProviderWeb } from '@waves.exchange/provider-web';
import {useCallback, useEffect, useState} from "preact/hooks";


const PROVIDERS = {
    LEDGER: ProviderLedger,
    KEEPER: ProviderKeeper,
    MAIL: ProviderCloud,
    WX: ProviderWeb
};



export const useSigner = (settings: { NODE: string }) => {

    const [signer, setSigner] = useState<Signer|null>(null);

    useEffect(() => {
        setSigner(new Signer({ NODE_URL: settings.NODE }))
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
}