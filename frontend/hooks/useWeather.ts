import { useState, useEffect } from "react";
import { weatherService } from "../services/weather.service";
import { CurrentWeather, DailyForecast } from "../types/weather";

export function useWeather(pinCode?: string) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      weatherService.getCurrentWeather(pinCode),
      weatherService.get7DayForecast(),
    ]).then(([curr, fore]) => {
      setCurrent(curr);
      setForecast(fore);
      setIsLoading(false);
    });
  }, [pinCode]);

  return { current, forecast, isLoading };
}