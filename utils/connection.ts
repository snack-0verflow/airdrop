import "dotenv/config";
import { Connection } from "@solana/web3.js";

export const RPC_URL = process.env.RPC_URL!;

export const connection = new Connection(RPC_URL);