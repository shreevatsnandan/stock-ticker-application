import SearchComponent from "../components/SearchComponent";
import Metadata from '@/components/Metadata'
import RollingTicker from "../components/RollingTicker";
import WatchlistViewer from "@/components/WatchlistViewer";

export default function Home() {
  return (
    <>
     <Metadata 
        title="Stock Market Live - NSE/BSE Real-time Prices"
        description="Track live stock prices, market movers, and get trading insights"
      />
    <RollingTicker />
    <SearchComponent />
    <WatchlistViewer/>
    </>
  );
}
