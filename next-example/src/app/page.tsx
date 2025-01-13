"use client";

import { usePrivy } from "@privy-io/react-auth";
import ConnectWalletButton from "./components/ConnectWalletButton";
import DisconnectWalletButton from "./components/DisconnectWalletButton";
import useQuote from "./hooks/useQuote";
import { useState } from "react";
import useSwapTx from "./hooks/useSwapTx";

const SELL_TOKEN_ADDRESS = "So11111111111111111111111111111111111111112"; // Sol
const BUY_TOKEN_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
const SELL_AMOUNT = 1000000;
const SLIPPAGE_BPS = 50;

export default function Home() {
  const { ready, authenticated, user } = usePrivy();
  const [shouldFetchQuote, setShouldFetchQuote] = useState(false);
  const [shouldFetchSwapTx, setShouldFetchSwapTx] = useState(false);

  const isConnected = ready && authenticated;
  const userAddress = user?.wallet?.address;

  const isFetchQuoteEnabled = isConnected && shouldFetchQuote;
  const { data: quoteData, isLoading: isLoadingQuote } = useQuote({
    sellTokenAddress: SELL_TOKEN_ADDRESS,
    buyTokenAddress: BUY_TOKEN_ADDRESS,
    sellAmount: SELL_AMOUNT,
    slippageBps: SLIPPAGE_BPS,
    isEnabled: isFetchQuoteEnabled,
  });

  const isFetchSwapTxEnabled = isConnected && quoteData && shouldFetchSwapTx;
  const {
    data: swapTxData,
    isLoading: isLoadingSwapTx,
    error: swapTxError,
  } = useSwapTx({
    quote: quoteData,
    userPublicKey: userAddress,
    isEnabled: isFetchSwapTxEnabled,
  });

  return (
    <div className="p-8">
      <main className="flex flex-col gap-16 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Next/React app example</h1>

        {/* --- Wallet connection step --- */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">1. Connect your wallet</h2>
          {ready && authenticated && (
            <div className="flex flex-col gap-2">
              Solana Wallet connected.
              <DisconnectWalletButton />
            </div>
          )}
          {ready && !authenticated && <ConnectWalletButton />}
          {!ready && <>Starting...</>}
        </section>

        {/* --- Fetch quote step --- */}
        {isConnected && (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">2. Fetch quote</h2>
            <div className="flex flex-col gap-2">
              {!shouldFetchQuote && (
                <button
                  onClick={() => setShouldFetchQuote(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Fetch quote
                </button>
              )}

              {isLoadingQuote && "Loading quote..."}

              {quoteData && (
                <div>
                  <div>Quote:</div>
                  <pre className="font-mono text-xs bg-gray-100 p-4 rounded-md h-48 overflow-auto w-96">
                    {JSON.stringify(quoteData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- Fetch swap step --- */}
        {isConnected && quoteData && (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">3. Fetch swap tx</h2>
            <div className="flex flex-col gap-2">
              {!shouldFetchSwapTx && (
                <button
                  onClick={() => setShouldFetchSwapTx(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Fetch swap tx
                </button>
              )}

              {isLoadingSwapTx && "Loading swap tx..."}

              {swapTxData && (
                <div>
                  <div>Quote:</div>
                  <pre className="font-mono text-xs bg-gray-100 p-4 rounded-md h-48 overflow-auto w-96">
                    {JSON.stringify(swapTxData, null, 2)}
                  </pre>
                </div>
              )}

              {swapTxError && (
                <div className="text-red-500">Error: {swapTxError.message}</div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
