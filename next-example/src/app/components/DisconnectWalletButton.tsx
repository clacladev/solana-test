"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function DisconnectWalletButton() {
  const { ready, authenticated, logout } = usePrivy();
  const isConnected = ready && authenticated;

  if (!isConnected) return null;

  return (
    <button
      onClick={logout}
      className="bg-gray-500 dark:bg-gray-800 text-white px-4 py-2 rounded-md"
    >
      Disconnect wallet
    </button>
  );
}
