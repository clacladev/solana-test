# Solana swap example using Jupiter APIs

Example script to swap tokens on Solana using Jupiter APIs.

## Create the secrets file

First, create a `.env.local` file in the root directory with the following content:

```
PRIVATE_KEY="xxx" # Your Solana wallet private key
QUICKNODE_SOLANA_API_TOKEN="xxx" # From https://dashboard.quicknode.com/endpoints/425288/security
```

## Installation

Install dependencies:

```
bun i
```

## Execution

Run the script:

```
bun run index.ts
```
