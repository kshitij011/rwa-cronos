// app/components/Navbar.tsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUSDCBalance } from "@/app/hooks/useUSDCBalance";

// Links for the navigation bar
const NavLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "KYC", href: "#kyc" },
    { name: "Properties", href: "#properties" },
];

export default function Navbar() {
    const { balance, loading } = useUSDCBalance();

  return (
    <nav
        className="
            flex items-center justify-between p-4 mb-8 rounded-2xl
            backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20
        "
    >
        {/* 1. Left Side: Logo and Brand */}
        <div className="flex items-center">
            <svg
                className="w-8 h-8 text-white mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.14 1.483L10 16l6.894 1.936a1 1 0 001.14-1.483l-7-14z"></path>
            </svg>
            <div className='flex flex-col'>
            <span className="text-xl font-bold text-white tracking-wider">
                Estate Token
            </span>
            <span className='font-extralight italic text-white'>Tokenizing Real World Assets worldwide</span>
            </div>
        </div>

        {/* 2. Middle Section: Navigation Links */}
        <div className="hidden md:flex space-x-8">
            {NavLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-pink-300 transition duration-150 font-medium"
                >
                    {link.name}
                </a>
            ))}
        </div>

        {/* 3. Right Side: Wallet Connection Button */}
        <div className="flex items-center space-x-4">

            {/* USDC Balance */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 border border-white/20 text-white text-sm">
                <span className="font-medium">USDC</span>
                <span className="text-pink-300">
                {loading ? "…" : Number(balance).toFixed(2)}
                </span>
            </div>

            {/* The ConnectButton handles the entire Web3 connection process */}
            <ConnectButton
                chainStatus={{
                    smallScreen: 'icon',
                    largeScreen: 'full', // Show icon and name on large screens
                }}
                accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full', // Show avatar and address
                }}
                showBalance={false} // Hide balance for a cleaner look
            />
        </div>
    </nav>
  );
}