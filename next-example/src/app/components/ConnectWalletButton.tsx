"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWalletButton() {
  const { ready, authenticated, login } = usePrivy();
  const isConnected = !ready || (ready && authenticated);

  return (
    <button
      disabled={isConnected}
      onClick={login}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Connect wallet
    </button>
  );
}
