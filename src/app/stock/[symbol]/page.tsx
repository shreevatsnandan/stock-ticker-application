"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchComponent from "@/components/SearchComponent";
import RollingTicker from "@/components/RollingTicker";
import Head from 'next/head';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface StockPrice {
    date: string;
    close: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    percent: number;
}

interface WatchlistStock {
    symbol: string;
    company: string;
}

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "MAX";

export default function StockPage() {
    
    const { symbol } = useParams<{ symbol: string }>();
    const [prices, setPrices] = useState<StockPrice[]>([]);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("1D");
    const [isLoading, setIsLoading] = useState(false);
    const [company, setCompany] = useState<string>("");
 const [companyName, setCompanyName] = useState(symbol);

   
    useEffect(() => {
        const fetchStock = async () => {
            setIsLoading(true);
            try {
                let type = "INTRADAY";
                let days = 1;
                let limit = 30;

                if (timePeriod === "1D") {
                    type = "INTRADAY";
                    days = 1;
                    limit = 30;
                }
                else if (timePeriod === "1W") {
                    type = "DAILY";
                    days = 7;
                    limit = 35;
                }
                else if (timePeriod === "1M") {
                    type = "DAILY";
                    days = 30;
                    limit = 30;
                }
                else if (timePeriod === "3M") {
                    type = "DAILY";
                    days = 90;
                    limit = 90;
                }
                else if (timePeriod === "MAX") {
                    type = "DAILY";
                    days = 10000;
                    limit = 10000;
                }
                const url = `https://portal.tradebrains.in/api/assignment/stock/${symbol}/prices?days=${days}&type=${type}&limit=${limit}`;

                const res = await fetch(url);
                const data: StockPrice[] = await res.json();
                
                setPrices(data);
                setCompany(symbol?.toUpperCase() || "");
            }
            catch (error) {
                console.error("Error", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchStock();
    }, [symbol, timePeriod]);


    useEffect(() => {
      const fetchCompany = async () => {
        try {
          const res = await fetch(`https://portal.tradebrains.in/api/assignment/search?keyword=${symbol}&length=1`);
          const data = await res.json();
          setCompanyName(data[0].company || symbol); 
        } catch (err) {
          console.error("Error fetching company name", err);
          setCompanyName(symbol);
        }
      };

      fetchCompany();
    });


useEffect(() => {
  if (companyName && symbol) {

    document.title = `${companyName} (${symbol}) Stock Price & Chart | Trade Brains`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.content = `real-time stock prices for ${companyName} (${symbol}).`;
  }
  
  return () => {
    document.title = 'Trade Brains | Stock Market Analysis';
  };
}, [companyName, symbol]);
   

    useEffect(() => {
        const saved = localStorage.getItem("watchlist");
        
        if (saved) {
            const list: WatchlistStock[] = JSON.parse(saved);
            setIsInWatchlist(list.some((s) => s.symbol === symbol));
        }
    }, [symbol]);

    const toggleWatchlist = () => {
        const saved = localStorage.getItem("watchlist");
        let list: WatchlistStock[] = saved ? JSON.parse(saved) : [];

        if (list.some((s) => s.symbol === symbol)) {
            list = list.filter((s) => s.symbol !== symbol);
            setIsInWatchlist(false);
        } else {
            list.push({ symbol, company });
            setIsInWatchlist(true);
        }

        localStorage.setItem("watchlist", JSON.stringify(list));
    };

    const formatXAxis = (val: string) => {
        const date = new Date(val);

        if (timePeriod === "1D") {
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
            });
        } else {
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
    };

    const formatTooltipLabel = (val: string) => {
        const date = new Date(val);

        if (timePeriod === "1D") {
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
            });
        } else {
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
    };

    return (
        <>
     

        <div className="min-h-screen bg-gray-50 text-black">
            <RollingTicker />
            <SearchComponent />
            <main className="container mx-auto px-4 py-6">
                <div className="text-4xl  text-black text-center rounded-full">
                    {companyName}
                </div>
                <div className="flex justify-center mb-6">
                    <button
                        onClick={toggleWatchlist}
                        className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${isInWatchlist ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} transition-colors`}>
                        {isInWatchlist ? (<>Remove from Watchlist</>) : (<>Add to Watchlist</>)}
                    </button>
                </div>
                <div className=" rounded-xl  p-4 mb-6">
                    <div className="h-80 w-full">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                     <p className="mt-3 text-gray-600">Loading...</p>
                                </div>
                            </div>
                        ) : prices.length > 0 ? (
                            <>
                           
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={prices} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 6" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatXAxis}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis />
                                    <Tooltip labelFormatter={formatTooltipLabel} />
                                    <Line
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#4f46e5"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#4f46e5' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-gray-600">No data available</p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setTimePeriod("1D")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timePeriod === "1D" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                            1D
                        </button>
                        <button
                            onClick={() => setTimePeriod("1W")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timePeriod === "1W" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                            1W
                        </button>
                        <button
                            onClick={() => setTimePeriod("1M")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timePeriod === "1M" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                            1M
                        </button>
                        <button
                            onClick={() => setTimePeriod("3M")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timePeriod === "3M" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                            3M
                        </button>
                        <button
                            onClick={() => setTimePeriod("MAX")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timePeriod === "MAX" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                            Max
                        </button>
                    </div>
                </div>

                {prices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Current Price</p>
                                    <p className="text-lg font-semibold">₹{prices[0].close}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center">

                                <div>
                                    <p className="text-sm text-gray-500">Change</p>
                                    <p className={`text-lg font-semibold ${prices[0].percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {prices[0].percent >= 0 ? '+' : ''}{prices[0].percent}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Volume</p>
                                    <p className="text-lg font-semibold">{prices[0].volume}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
        </>
    );
}
