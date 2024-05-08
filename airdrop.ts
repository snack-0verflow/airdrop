import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Explorer } from "./utils/explorer";
import { connection } from "./utils/connection";
import { Keypairs } from "./utils/keypairs";

async function main() {
  const lamports = 2 * LAMPORTS_PER_SOL;
  const signature = await connection.requestAirdrop(
    Keypairs.dev.publicKey,
    lamports
  );
  console.log("[info] airdrop", {
    wallet: Keypairs.dev.publicKey.toString(),
    lamports,
    signature,
    url: Explorer.tx(signature),
  });
  // https://explorer.solana.com/tx/diBoLvasifAZy9t8vNJeVCvK8BdoJKkETF8WSRgBc7qWEBFNJ4cUWnZSWX21qTR4p1R1XPwtsQ493CHwGFb19B1?cluster=devnet
}

main().catch(console.error);
