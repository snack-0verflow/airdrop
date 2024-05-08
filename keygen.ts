import { Keypair } from "@solana/web3.js";

const wallet = Keypair.generate();

console.log(
  `You've generated a new Solana wallet: ${wallet.publicKey.toBase58()}`
);

console.log(
  `Here is the wallet secret: ${wallet.secretKey}`
);