import { MOCK_CURRENT_WEATHER, MOCK_FORECAST_7DAYS } from "../store/weather.store";
import { CurrentWeather, DailyForecast } from "../types/weather";

export const weatherService = {
  async getCurrentWeather(pinCode?: string): Promise<CurrentWeather> {
    return {
      ...MOCK_CURRENT_WEATHER,
      location: pinCode ? `PIN Code ${pinCode}` : MOCK_CURRENT_WEATHER.location,
    };
  },
  async get7DayForecast(): Promise<DailyForecast[]> {
    return MOCK_FORECAST_7DAYS;
  },
};