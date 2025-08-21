"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WatchlistStock {
  symbol: string;
  company: string;
}

export default function WatchlistViewer() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
    console.log(saved);
  }, []);

  if (watchlist.length === 0) {
    return <p className="text-gray-500 text-sm p-4">No stocks in watchlist</p>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-black overflow-hidden">
      {watchlist.map((stock, idx) => (
        <Link
          key={idx}
          href={`/stock/${stock.symbol}`}
          className="block p-3 sm:p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 no-underline text-inherit"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-sm sm:text-base text-gray-800">
                {stock.company}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {stock.symbol}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
