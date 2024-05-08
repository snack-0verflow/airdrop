import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Wallets } from "./utils/wallets";
import { Keypairs } from "./utils/keypairs";
import { RPC_URL, connection } from "./utils/connection";
import { Explorer } from "./utils/explorer";

async function estimateNetworkFee(message: string) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "getFeeForMessage",
      params: [
        message,
        {
          commitment: "processed",
        },
      ],
    }),
  });
  const json = (await response.json()) as any;
  return (json.result.value ?? 0) as number;
}

async function buildTransferTransaction(lamports: number) {
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: Keypairs.dev.publicKey,
      toPubkey: Wallets.WBASignup,
      lamports,
    })
  );
  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = Keypairs.dev.publicKey;
  return transaction;
}

async function smallTransfer() {
  const transaction = await buildTransferTransaction(LAMPORTS_PER_SOL / 100);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    Keypairs.dev,
  ]);
  console.log("[info] simple transfer tx", {
    signature,
    url: Explorer.tx(signature),
  });
}

async function remainingTransfer() {
  const balance = await connection.getBalance(Keypairs.dev.publicKey);
  const transaction = await buildTransferTransaction(balance);
  const message = transaction.serializeMessage().toString("base64");

  // Estimate network fee
  const fee = await estimateNetworkFee(message);

  console.log("[info] fee", {
    balance,
    fee: await connection.getFeeForMessage(transaction.compileMessage()),
    message,
  });

  console.log("[info] estimated fee", { fee });

  // Subtract fee from transfer amount as total transferable lamports amount
  transaction.instructions.pop();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: Keypairs.dev.publicKey,
      toPubkey: Wallets.WBASignup,
      lamports: balance - fee,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    Keypairs.dev,
  ]);

  console.log("[info] remaining transfer tx", {
    signature,
    url: Explorer.tx(signature),
  });
  // https://explorer.solana.com/tx/2a9F46QdkhNzmYnVAitvSqrjgj2Xq1p86uzUg9VHB5cLcndVhRaKiqVcCTAtgWGedmFHnYmC1FbKZwH5zBPcGzb3?cluster=devnet
}

export async function main() {
  // await smallTransfer();
  await remainingTransfer();
}

main().catch(console.error);
