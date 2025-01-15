import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getConnection } from "../utils";

async function sendTransaction(
  swapTx: string,
  wallet: ConnectedSolanaWallet
): Promise<UseSendSwapTxData> {
  const blockhash = await getConnection().getLatestBlockhash();

  const swapTxBuffer = Buffer.from(swapTx, "base64");
  const transaction = VersionedTransaction.deserialize(swapTxBuffer);
  const txId = await wallet.sendTransaction(transaction, getConnection());

  return { txId, blockhash };
}

type UseSendSwapTxProps = {
  swapTx: string | undefined;
  wallet: ConnectedSolanaWallet | undefined;
  isEnabled: boolean;
  onSuccess?: (data: UseSendSwapTxData) => void;
  onError?: (error: Error) => void;
};

type UseSendSwapTxData = {
  txId: string;
  blockhash: BlockhashWithExpiryBlockHeight;
};

export default function useSendSwapTx({
  swapTx,
  wallet,
  isEnabled,
  onSuccess = undefined,
  onError = undefined,
}: UseSendSwapTxProps) {
  const [data, setData] = useState<UseSendSwapTxData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const arePropsValid = swapTx && wallet;
    if (!isEnabled || !arePropsValid || isLoading) return;

    setIsLoading(true);
    setError(undefined);

    sendTransaction(swapTx, wallet)
      .then((data) => {
        setData(data);
        setIsLoading(false);
        onSuccess?.(data);
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
