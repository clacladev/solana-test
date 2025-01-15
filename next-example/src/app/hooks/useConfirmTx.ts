import { useEffect, useState } from "react";
import { getConnection } from "../utils";
import { BlockhashWithExpiryBlockHeight } from "@solana/web3.js";

const makeKey = (
  txId: string | undefined,
  latestBlockHash: BlockhashWithExpiryBlockHeight | undefined
) => `${txId}-${latestBlockHash?.blockhash}`;

async function confirmTransaction(
  txId: string,
  latestBlockHash: BlockhashWithExpiryBlockHeight
) {
  return getConnection().confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txId,
  });
}

type UseConfirmTxProps = {
  txId: string | undefined;
  latestBlockHash: BlockhashWithExpiryBlockHeight | undefined;
  isEnabled: boolean;
};

export default function useConfirmTx({
  txId,
  latestBlockHash,
  isEnabled,
}: UseConfirmTxProps) {
  const [key, setKey] = useState(makeKey(txId, latestBlockHash));
  const [data, setData] = useState(false); // Is confirmed?
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const arePropsValid = txId && latestBlockHash;
    if (!isEnabled || !arePropsValid || isLoading) return;

    const newKey = makeKey(txId, latestBlockHash);
    if (key === newKey) return;

    setKey(newKey);
    setIsLoading(true);
    setError(undefined);

    confirmTransaction(txId, latestBlockHash)
      .then((data) => {
        if (data.value.err) {
          throw new Error(data.value.err.toString());
        }
        setData(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [isEnabled, isLoading, txId, latestBlockHash, key]);

  return {
    data,
    isLoading,
    error,
  };
}
