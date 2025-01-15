import useSWR from "swr";

const fetcher = async ([, quote, userPublicKey]: [
  key: string,
  quote: unknown,
  userPublicKey: string
]) => {
  const response = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // quoteResponse from /quote api
      quoteResponse: quote,
      // user public key to be used for the swap
      userPublicKey, //: wallet.publicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
      // custom priority fee
      // prioritizationFeeLamports: "auto", // in normal conditions, use auto
      prioritizationFeeLamports: {
        autoMultiplier: 2, // when there's a lot of congestions for the pair, double the suggested fee
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch swap transaction");
  }
  const { swapTransaction } = await response.json();
  return swapTransaction;
};

type UseFetchSwapTxProps = {
  quote: unknown | undefined;
  userPublicKey: string | undefined;
  isEnabled: boolean;
};

export default function useFetchSwapTx({
  quote,
  userPublicKey,
  isEnabled,
}: UseFetchSwapTxProps) {
  const arePropsValid = quote && userPublicKey;

  return useSWR(
    isEnabled && arePropsValid
      ? ["useSwapTx", quote, userPublicKey]
      : undefined,
    fetcher
  );
}
