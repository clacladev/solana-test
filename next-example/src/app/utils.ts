"use client";

import { Connection } from "@solana/web3.js";

const connection = new Connection(
  `https://tame-wiser-ensemble.solana-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_SOLANA_API_TOKEN}/`
);

export const getConnection = () => connection;
