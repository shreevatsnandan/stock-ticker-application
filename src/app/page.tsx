import SearchComponent from "../components/SearchComponent";

import RollingTicker from "../components/RollingTicker";
import WatchlistViewer from "@/components/WatchlistViewer";

export default function Home() {
  return (
    <>
     
    <RollingTicker />
    <SearchComponent />
    <WatchlistViewer/>
    </>
  );
}
