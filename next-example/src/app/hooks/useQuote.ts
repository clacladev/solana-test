import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type UseQuoteProps = {
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: number;
  slippageBps: number;
  isEnabled: boolean;
};

export default function useQuote({
  sellTokenAddress,
  buyTokenAddress,
  sellAmount,
  slippageBps,
  isEnabled,
}: UseQuoteProps) {
  const arePropsValid = sellTokenAddress && buyTokenAddress && sellAmount;

  return useSWR(
    isEnabled && arePropsValid
      ? `https://quote-api.jup.ag/v6/quote?inputMint=${sellTokenAddress}&outputMint=${buyTokenAddress}&amount=${sellAmount}&slippageBps=${slippageBps}`
      : undefined,
    fetcher
  );
}
