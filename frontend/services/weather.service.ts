import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./axios";
import { MOCK_CURRENT_WEATHER, MOCK_FORECAST_7DAYS } from "../store/weather.store";
import { CurrentWeather, DailyForecast } from "../types/weather";

export const weatherService = {
  async getCurrentWeather(pinCode?: string): Promise<CurrentWeather> {
    try {
      const data = await apiClient.get<CurrentWeather>(API_ENDPOINTS.WEATHER.CURRENT, {
        query: { lat: 30.901, lng: 75.857, pinCode },
      });
      if (data && data.temperature) {
        return {
          ...data,
          location: pinCode ? `PIN Code ${pinCode}` : data.location || MOCK_CURRENT_WEATHER.location,
        };
      }
    } catch {
      // Safe fallback to mock weather data
    }

    return {
      ...MOCK_CURRENT_WEATHER,
      location: pinCode ? `PIN Code ${pinCode}` : MOCK_CURRENT_WEATHER.location,
    };
  },

  async get7DayForecast(): Promise<DailyForecast[]> {
    try {
      const data = await apiClient.get<DailyForecast[]>(API_ENDPOINTS.WEATHER.FORECAST, {
        query: { lat: 30.901, lng: 75.857, days: 7 },
      });
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // Safe fallback to mock forecast
    }

    return MOCK_FORECAST_7DAYS;
  },
};