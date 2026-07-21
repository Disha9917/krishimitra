export interface CurrentWeather {
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // Percentage
  rainfall: number; // mm
  windSpeed: number; // km/h
  windDirection: string;
  weatherCondition: "Sunny" | "Partly Cloudy" | "Cloudy" | "Light Rain" | "Heavy Rain" | "Thunderstorm";
  uvIndex: number;
  airQualityIndex: number;
  location: string;
  updatedAt: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainfallProbability: number;
  humidity: number;
  windSpeed: number;
  irrigationNeeded: boolean;
  diseaseRisk: "Low" | "Medium" | "High";
}