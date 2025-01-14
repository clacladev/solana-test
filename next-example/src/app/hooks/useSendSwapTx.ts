import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

const connection = new Connection(
  `https://tame-wiser-ensemble.solana-mainnet.quiknode.pro/${process.env.QUICKNODE_SOLANA_API_TOKEN}/`
);

async function sendTransaction(swapTx: string, wallet: ConnectedSolanaWallet) {
  const swapTxBuffer = Buffer.from(swapTx, "base64");
  const transaction = VersionedTransaction.deserialize(swapTxBuffer);
  return await wallet.sendTransaction!(transaction, connection);
}

type UseSendSwapTxProps = {
  swapTx: string | undefined;
  wallet: ConnectedSolanaWallet | undefined;
  isEnabled: boolean;
  onSuccess?: (txId: string) => void;
  onError?: (error: Error) => void;
};

export default function useSendSwapTx({
  swapTx,
  wallet,
  isEnabled,
  onSuccess = undefined,
  onError = undefined,
}: UseSendSwapTxProps) {
  const [data, setData] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const arePropsValid = swapTx && wallet;
    if (!isEnabled || !arePropsValid || isLoading) return;

    setIsLoading(true);
    sendTransaction(swapTx, wallet)
      .then((txId) => {
        setData(txId);
        setIsLoading(false);
        onSuccess?.(txId);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        onError?.(error);
      });
  }, [swapTx, wallet, isEnabled, isLoading, onSuccess, onError]);

  return {
    data,
    isLoading,
    error,
  };
}
