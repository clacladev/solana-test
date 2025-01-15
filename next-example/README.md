# Solana swap Next.js example app using Jupiter APIs

Example Next.js app to swap tokens on Solana using Jupiter APIs.

## Create the secrets file

First, create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_PRIVY_APP_ID="" # From https://dashboard.privy.io/
PRIVY_APP_SECRET=""
NEXT_PUBLIC_QUICKNODE_SOLANA_API_TOKEN="xxx" # From https://dashboard.quicknode.com/endpoints/

```

## Installation

Install dependencies:

```
bun i
```

## Execution

Run the script:

```
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

Useful docs:

- https://station.jup.ag/docs/APIs/swap-api#guide-for-v6-swap-api-code-example
- https://docs.privy.io/guide/react/wallets/usage/solana/
- https://docs.privy.io/guide/expo/embedded/solana/usage
