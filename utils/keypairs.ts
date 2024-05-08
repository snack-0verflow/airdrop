import { Keypair } from "@solana/web3.js";
import devPrivateKey from "../.wallets/dev-wallet.json";
import wbaPrivateKey from "../.wallets/wba-wallet.json";

export const Keypairs = {
  dev: Keypair.fromSecretKey(Uint8Array.from(devPrivateKey)),
  wbaSignup: Keypair.fromSecretKey(Uint8Array.from(wbaPrivateKey)),
};