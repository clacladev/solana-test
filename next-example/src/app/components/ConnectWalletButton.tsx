"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWalletButton() {
  const { ready, authenticated, login } = usePrivy();
  const isConnected = !ready || (ready && authenticated);

  return (
    <button
      disabled={isConnected}
      onClick={login}
      className="btn bg-green-400 border-green-500 border-2 rounded-md"
    >
      Connect wallet
    </button>
  );
}
