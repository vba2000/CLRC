import { settings as mainnetSett } from './mainnet';

export interface Settings {
    NODE: string;
    DAPP: string;
    CLRC_ID: string;
    NETWORK: string;
}

export const mainnet = mainnetSett;