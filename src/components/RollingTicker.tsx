"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface TickerStock {
    symbol: string;
    close: number;
    change: number;
    percent: number;
    type?: "gain" | "loss";
}

export default function RollingTicker() {
    const [stocks, setStocks] = useState<TickerStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTicker = async () => {
            try {
                const res = await axios.get(
                    "https://portal.tradebrains.in/api/assignment/index/NIFTY/movers/"
                );

                const gainers = res.data?.gainers || [];
                const losers = res.data?.losers || [];

                const combined = [
                    ...gainers.map((s: TickerStock) => ({ ...s, type: "gain" })),
                    ...losers.map((s: TickerStock) => ({ ...s, type: "loss" })),
                ];

                setStocks(combined);
                setIsLoading(false);
            } catch (err) {
                console.error("Error", err);
                setIsLoading(false);
            }
        };

        fetchTicker();
        const interval = setInterval(fetchTicker, 100000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black text-white py-3 overflow-hidden relative">
            {isLoading ? (
                <div className="text-center">Loading market data...</div>
            ) :  (
                <div className="slider relative w-full overflow-hidden">
                    <div className="slide-track flex animate-scroll">
                        {[...stocks, ...stocks].map((stock, idx) => (
                            <Link key={`${stock.symbol}-${idx}`}  href={`/stock/${stock.symbol}`}>
                            <div
                                key={`${stock.symbol}-${idx}`}
                                className="slide flex-shrink-0 w-64 h-20 flex flex-col items-center justify-center mx-4 bg-gray-900 rounded-lg shadow"
                            >
                                <span className="font-semibold">{stock.symbol}</span>
                                <span>₹{stock.close.toFixed(2)}</span>
                                <span
                                    className={
                                        stock.percent >= 0 ? "text-green-400" : "text-red-400"
                                    }
                                >
                                    {stock.percent >= 0 ? "↑ " : "↓ "}
                                    {Math.abs(stock.percent).toFixed(2)}%
                                </span>
                            </div>
                            </Link>
                        ))}
                    </div>

                </div>
            ) 
            }
        </div>
    );
}
