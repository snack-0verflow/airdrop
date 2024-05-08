import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";

import { IDL, WbaPrereq } from "./programs/wba_prereq";
import { connection } from "./utils/connection";
import { Keypairs } from "./utils/keypairs";
import bs58 from "bs58";
import { Explorer } from "./utils/explorer";

const wallet = new Wallet(Keypairs.wbaSignup);
const anchorProvider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
const program = new Program(IDL as any, anchorProvider);

async function main() {
  const enrollmentSeeds = [
    Buffer.from("prereq"),
    Keypairs.wbaSignup.publicKey.toBuffer(),
  ];
  const [enrollmentKey, bump] = PublicKey.findProgramAddressSync(
    enrollmentSeeds,
    program.programId
  );
  const github = Buffer.from("snack-0verflow", "utf8");
  // @ts-ignore
  const signature = await program.methods
    .complete(github)
    .accounts({
      signer: Keypairs.wbaSignup.publicKey,
      // prereq: enrollmentKey
    })
    .signers([Keypairs.wbaSignup])
    .rpc();

  // const url = Explorer.tx(signature);

  // console.log('[info] enrollment', {
  //   signature,
  //   url
  // })
}

main().catch(console.error);
