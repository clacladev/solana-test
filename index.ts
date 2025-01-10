// Inspiration from https://station.jup.ag/docs/APIs/swap-api

import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";

// 0. Create a connection and wallet
const connection = new Connection(
  `https://tame-wiser-ensemble.solana-mainnet.quiknode.pro/${process.env.QUICKNODE_SOLANA_API_TOKEN}/`
);
// Or use these public RPC endpoints:
// "https://api.mainnet-beta.solana.com"
// "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"

const wallet = new Wallet(
  Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || ""))
);

// 1. Swapping SOL to USDC with input 0.001 SOL and 0.5% slippage
const quoteResponse = await fetch(
  "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\
&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\
&amount=1000000\
&slippageBps=50"
);
const quote = await quoteResponse.json();
console.log("--> Quote:", quote);

// 2. Get serialized transactions for the swap
const swapTransactionResponse = await fetch(
  "https://quote-api.jup.ag/v6/swap",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // quoteResponse from /quote api
      quoteResponse: quote,
      // user public key to be used for the swap
      userPublicKey: wallet.publicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
      // custom priority fee
      // prioritizationFeeLamports: "auto", // in normal conditions, use auto
      prioritizationFeeLamports: {
        autoMultiplier: 2, // when there's a lot of congestions for the pair, double the suggested fee
      },
    }),
  }
);
const { swapTransaction } = await swapTransactionResponse.json();

// 3. deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
// console.log("--> Transaction:", transaction);

// 4. sign the transaction
transaction.sign([wallet.payer]);

// get the latest block hash
const latestBlockHash = await connection.getLatestBlockhash();
console.log("--> Latest block hash:", latestBlockHash);

// 5. Execute the transaction
const rawTransaction = transaction.serialize();
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
  maxRetries: 2,
});
console.log(`--> Waiting for confirmation...`);

// 6. Wait for confirmation
await connection.confirmTransaction({
  blockhash: latestBlockHash.blockhash,
  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  signature: txid,
});
console.log(`--> Tx confirmed! Details: https://solscan.io/tx/${txid}`);
