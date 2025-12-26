# 🏠 Estate Tokens – Tokenizing Real-World Assets on EVM

Estate Tokens is a decentralized platform that enables tokenization of Real World Assets (RWAs), allowing users to mint fractional ownership tokens (shares) of real estate properties across the globe.

Our mission: **Make global real-estate investing accessible, transparent, and permissionless.**

---

## 🚀 How It Works

1. **Connect Wallet**
   Users connect their Metamask wallet to the platform.

2. **Complete KYC Verification**
   Users upload KYC details and submit them for verification.

3. **Buy Property Shares**
   Once verified, users can mint estate tokens (fractional shares) of verified properties and later sell them for potential profit.

---

## 🔧 Technical Overview

### **1. Solana Program**

The Estate Token smart contract is written in **Solidity using Hardhat**, fully tested and audited.

📌 **Deployed on Cronos-Testnet:**

```bash
0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0
```

The program handles:

- KYC-based user share accounts
- Minting property shares
- Property-specific validation
- Secure and constraint-checked logic

---

### **2. Frontend**

Built with:

- **React / Next.js**
- **Wagmi Wallet Adapter**
- **Viem**
- **x402-axios** for streamlined payment execution

#### ▶️ Run the frontend

```bash
npm install
npm run dev
```

---

### **3. Backend**

The backend integrates the x402 protocol, enabling:

- Secure transaction processing
- Payment validations
- Transaction status confirmation before minting tokens
- Mint's shares to user's account using deployer's private key.

> Environment variables

```bash
SELLER_WALLET=0x75..

DEPLOYER_PRIVATE_KEY=0xzyx..

ERC1155_ADDRESS=0x374..
```

#### ▶️ Run the frontend

```bash
npm install
npm run dev
```

## 📸 Screenshots

### Home Page

![Home Page](./screenshots/home.png)

### Property Listing

![Property Listing](./screenshots/property-listing.png)

### KYC Page

![KYC Page](./screenshots/kyc-verification.png)

### Verified KYC

![Verified KYC Page](./screenshots/verified-kyc.png)

### Connect Wallet

![Wallet Connect](./screenshots/wallet-connect.png)
