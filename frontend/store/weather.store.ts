import { CurrentWeather, DailyForecast } from "../types/weather";

export const MOCK_CURRENT_WEATHER: CurrentWeather = {
  temperature: 28,
  feelsLike: 30,
  humidity: 78,
  rainfall: 12.4,
  windSpeed: 14,
  windDirection: "NW",
  weatherCondition: "Partly Cloudy",
  uvIndex: 6,
  airQualityIndex: 45,
  location: "Ludhiana, Punjab (Pin: 141001)",
  updatedAt: "Just now",
};

export const MOCK_FORECAST_7DAYS: DailyForecast[] = [
  { day: "Day 1", date: "Today", tempMax: 29, tempMin: 21, condition: "Partly Cloudy", rainfallProbability: 20, humidity: 75, windSpeed: 12, irrigationNeeded: false, diseaseRisk: "Low" },
  { day: "Day 2", date: "Tomorrow", tempMax: 31, tempMin: 22, condition: "Sunny", rainfallProbability: 10, humidity: 65, windSpeed: 10, irrigationNeeded: true, diseaseRisk: "Low" },
  { day: "Day 3", date: "Jul 23", tempMax: 27, tempMin: 20, condition: "Light Rain", rainfallProbability: 70, humidity: 88, windSpeed: 18, irrigationNeeded: false, diseaseRisk: "High" },
  { day: "Day 4", date: "Jul 24", tempMax: 28, tempMin: 21, condition: "Thunderstorm", rainfallProbability: 85, humidity: 90, windSpeed: 22, irrigationNeeded: false, diseaseRisk: "High" },
  { day: "Day 5", date: "Jul 25", tempMax: 30, tempMin: 22, condition: "Partly Cloudy", rainfallProbability: 30, humidity: 78, windSpeed: 14, irrigationNeeded: false, diseaseRisk: "Medium" },
  { day: "Day 6", date: "Jul 26", tempMax: 32, tempMin: 23, condition: "Sunny", rainfallProbability: 5, humidity: 60, windSpeed: 8, irrigationNeeded: true, diseaseRisk: "Low" },
  { day: "Day 7", date: "Jul 27", tempMax: 33, tempMin: 24, condition: "Sunny", rainfallProbability: 0, humidity: 55, windSpeed: 11, irrigationNeeded: true, diseaseRisk: "Low" },
];

export const weatherStore = {
  getCurrentWeather: () => MOCK_CURRENT_WEATHER,
  getForecast: () => MOCK_FORECAST_7DAYS,
};