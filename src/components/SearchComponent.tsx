"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import axios from "axios";
import { useRouter } from "next/navigation";

interface Stock {
  company: string;
  symbol: string;
}

export default function SearchComponent() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isOpen, setIsopen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsopen(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get<Stock[]>(
          `https://portal.tradebrains.in/api/assignment/search?keyword=${query}&length=8`
        );
        setResults(res.data || []);
        setIsopen(true);
      } catch (err) {
        console.error("Error", err);
        setIsopen(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);



  return (
    <div className="relative my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      <Link
        href="/"
        className="block text-center text-4xl mb-3 md:text-3xl font-bold text-gray-800"
      >
        Trade Brains
        </Link>

      <input
        type="text"
        placeholder="Search stock..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsopen(true)} 
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <ul className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
            {results.map((stock) => (
              <li key={stock.symbol}>
                <Link
                  href={`/stock/${stock.symbol}`}
                  className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 no-underline text-inherit"
                  onClick={() => setIsopen(false)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm md:text-base text-gray-800">
                      {stock.company}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {stock.symbol}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="border border-gray-200 rounded-lg bg-white shadow-lg p-4 text-center text-gray-500 text-sm md:text-base">
            No results found
          </div>
        </div>
      )}
    </div>
  );
}