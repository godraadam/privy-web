export interface PrivyContact {
    alias: string;
    pubkey: string;
    address: string;
    trusted: boolean;
    proxy: boolean,
    hash?: string;
  }