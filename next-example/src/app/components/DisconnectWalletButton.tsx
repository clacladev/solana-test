"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function DisconnectWalletButton() {
  const { ready, authenticated, logout } = usePrivy();
  const isConnected = ready && authenticated;

  if (!isConnected) return null;

  return (
    <button
      onClick={logout}
      className="bg-gray-200 border-gray-300 border-2 rounded-md cursor-default"
    >
      Disconnect wallet
    </button>
  );
}
