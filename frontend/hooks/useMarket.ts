import { useState, useEffect } from "react";
import { marketService } from "../services/market.service";
import { MarketPriceItem } from "../types/market";

export function useMarket() {
  const [prices, setPrices] = useState<MarketPriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    marketService.getMarketPrices().then((res) => {
      setPrices(res);
      setIsLoading(false);
    });
  }, []);

  return { prices, isLoading };
}