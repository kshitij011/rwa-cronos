import 'dotenv/config';
import express, {type Request, type Response} from 'express';
import axios from 'axios';
const app = express();
app.use(express.json());
import { approveKycUser } from "./blockchain/approveKYC.js";
import { mintShares } from "./blockchain/mintShares.js";
import cors from "cors";
import type { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [
      "https://rwa-cronos.vercel.app",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Expose-Headers",
    "X-Payment",
    "X-Payment-Token",
    "X-Payment-Signature",
    "X-402-Payment",
  ],

  exposedHeaders: [
    "X-Payment",
    "X-Payment-Token",
    "X-Payment-Signature",
    "X-402-Payment",
  ],

  methods: ["GET", "POST", "OPTIONS"],
};

app.use(cors(corsOptions));


// Configuration
const FACILITATOR_URL = 'https://facilitator.cronoslabs.org/v2/x402';
const SELLER_WALLET: string = process.env.SELLER_WALLET ? process.env.SELLER_WALLET : "";
const USDX_CONTRACT = '0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0'; // Cronos testnet - see Network Constants
const PORT = 4000;

// Protected API endpoint
app.post('/api/purchase', async (req: Request, res: Response) => {

  const { totalPrice } = req.body;
  const paymentHeader = req.headers['x-payment'] || req.body?.paymentHeader;
  const rawBalance = totalPrice * 1e6; // Convert to 6 decimal places

  // Step 1: Check if payment is provided
  if (!paymentHeader) {
    return res.status(402).json({
      error: 'Payment Required',
      x402Version: 1,
      paymentRequirements: {
        scheme: 'exact',
        network: 'cronos-testnet', // Switch to 'cronos' for Cronos mainnetd
        payTo: SELLER_WALLET,
        asset: USDX_CONTRACT,
        description: 'Premium API data access',
        mimeType: 'application/json',
        maxAmountRequired: rawBalance.toString(), // 0.1 USDX (6 decimals)
        maxTimeoutSeconds: 300
      }
    });
  }

  try {
    const requestBody = {
      x402Version: 1,
      paymentHeader: paymentHeader,
      paymentRequirements: {
        scheme: 'exact',
        network: 'cronos-testnet', // Same network as in 402 response
        payTo: SELLER_WALLET,
        asset: USDX_CONTRACT,
        description: 'Premium API data access',
        mimeType: 'application/json',
        maxAmountRequired: rawBalance.toString(),
        maxTimeoutSeconds: 300
      }
    };

    // Step 2: Verify payment
    const verifyRes = await axios.post(`${FACILITATOR_URL}/verify`, requestBody, {
      headers: { 'Content-Type': 'application/json', 'X402-Version': '1' }
    });

    if (!verifyRes.data.isValid) {
      return res.status(402).json({
        error: 'Invalid payment',
        reason: verifyRes.data.invalidReason
      });
    }

    // Step 3: Settle payment
    const settleRes = await axios.post(`${FACILITATOR_URL}/settle`, requestBody, {
      headers: { 'Content-Type': 'application/json', 'X402-Version': '1' }
    });

    // Step 4: Check settlement and return content
    if (settleRes.data.event === 'payment.settled') {

      return res.status(200).json({
        ok: true,
        mintTxHash: settleRes.data.txHash,
        payment: {
          txHash: settleRes.data.txHash,
          from: settleRes.data.from,
          to: settleRes.data.to,
          value: settleRes.data.value,
          blockNumber: settleRes.data.blockNumber,
          timestamp: settleRes.data.timestamp
        }
      });
    } else {
      return res.status(402).json({
        error: 'Payment settlement failed',

        reason: settleRes.data.error
      });
    }
  } catch (error: unknown) {

    if (axios.isAxiosError(error)){
    console.log("FACILITATOR ERROR:", error.response?.data);

      return res.status(500).json({
        error: 'Server error processing payment',
        details: error.response?.data || error.message
      });
    }

    return res.status(500).json({
      error: 'Server error processing payments',
      details: (error as Error).message || 'An unknown error occured'
    })
  }
});

app.post("/kyc/approve", async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ ok: false, error: "Address required" });
  }

  try {
    const result = await approveKycUser(address);
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: "KYC approval failed" });

  }
});

app.post("/mint", async (req, res) => {
  const { propertyId, quantity, buyer, totalPrice } = req.body;

  const mintTxHash = await mintShares({
    receiver: buyer,
    propertyId: BigInt(propertyId),
    amount: BigInt(quantity),
    pricePaid: BigInt(Math.floor(Number(totalPrice) * 1e6)),
  });

  res.json({
    ok: true,
    mintTxHash: mintTxHash,
  });
});

app.listen(PORT, () => {
  console.log("Backend running on port ", PORT);
});