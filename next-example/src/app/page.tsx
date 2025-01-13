"use client";

import { usePrivy } from "@privy-io/react-auth";
import ConnectWalletButton from "./components/ConnectWalletButton";
import DisconnectWalletButton from "./components/DisconnectWalletButton";

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const isConnected = ready && authenticated;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Next/React app example</h1>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">1. Connect your wallet</h2>
          {isConnected ? (
            <div className="flex flex-col gap-2">
              Solana Wallet connected.
              <DisconnectWalletButton />
            </div>
          ) : (
            <ConnectWalletButton />
          )}
        </section>
      </main>
    </div>
  );
}
