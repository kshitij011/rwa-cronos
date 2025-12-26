import { bytesToHex, type Hex, type WalletClient } from "viem";

const CRONOS_TESTNET_CHAIN_ID = 338;

/**
 * Secure nonce generator (browser-native)
 */
function generateNonce(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function ensureCronosTestnet(walletClient: WalletClient) {
  if (walletClient.chain?.id !== CRONOS_TESTNET_CHAIN_ID) {
    await walletClient.switchChain({
      id: CRONOS_TESTNET_CHAIN_ID,
    });
  }
}

async function createPaymentHeader({
  walletClient,
  paymentRequirements,
}: {
  walletClient: WalletClient;
  paymentRequirements: any;
}) {
  const {
    payTo,
    asset,
    maxAmountRequired,
    maxTimeoutSeconds,
    scheme,
    network,
  } = paymentRequirements;

  const [from] = await walletClient.getAddresses();

  const nonce = generateNonce();
  const validAfter = BigInt(0);
  const validBefore = BigInt(
    Math.floor(Date.now() / 1000) + maxTimeoutSeconds
  );

  const domain = {
    name: "Bridged USDC (Stargate)",
    version: "1",
    chainId: CRONOS_TESTNET_CHAIN_ID,
    verifyingContract: asset as `0x${string}`,
  };

  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  const message = {
    from,
    to: payTo,
    value: BigInt(maxAmountRequired),
    validAfter,
    validBefore,
    nonce,
  };

  const [account] = await walletClient.getAddresses();

const signature = await walletClient.signTypedData({
  account,
  domain,
  types,
  primaryType: "TransferWithAuthorization",
  message,
});


  const paymentHeader = {
    x402Version: 1,
    scheme,
    network,
    payload: {
      from,
      to: payTo,
      value: maxAmountRequired,
      validAfter: validAfter.toString(),
      validBefore: validBefore.toString(),
      nonce,
      signature,
      asset,
    },
  };

  return btoa(JSON.stringify(paymentHeader));
}

/**
 * x402 fetch wrapper (Cronos testnet)
 */
export async function x402Fetch(
  walletClient: WalletClient,
  url: string,
  options: RequestInit = {}
) {
  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  await ensureCronosTestnet(walletClient);

  // 1️⃣ Initial request (expect 402)
  const initialRes = await fetch(url, options);

  if (initialRes.status !== 402) {
    return initialRes;
  }

  const { paymentRequirements } = await initialRes.json();

  // 2️⃣ Sign payment
  const paymentHeader = await createPaymentHeader({
    walletClient,
    paymentRequirements,
  });

  // 3️⃣ Retry with payment header
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "X-Payment": paymentHeader,
    },
  });
}
