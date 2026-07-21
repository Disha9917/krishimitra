import * as React from "react";
import { WeatherWidget } from "../cards/weather-widget";
import { Timeline } from "../common/timeline";
import { useWeather } from "../../hooks/useWeather";
import { MOCK_CURRENT_WEATHER, MOCK_FORECAST_7DAYS } from "../../store/weather.store";

export function WeatherInsightsModule() {
  const { current, forecast } = useWeather();
  const weatherData = current || MOCK_CURRENT_WEATHER;
  const forecastData = forecast.length ? forecast : MOCK_FORECAST_7DAYS;

  // Adapt 7-day forecast to DayAdvisory format for timeline
  const timelineDays = forecastData.map((f, i) => ({
    day: i + 1,
    date: f.date,
    dayName: f.day,
    weatherCondition: f.condition,
    temperature: `${f.tempMax}°C / ${f.tempMin}°C`,
    rainfallProbability: f.rainfallProbability,
    irrigation: f.irrigationNeeded ? "Recommended" : "Skip",
    fertilizer: i === 0 ? "Top-Dressing Urea" : "None",
    diseaseRisk: f.diseaseRisk,
  }));

  return (
    <div className="space-y-8">
      <WeatherWidget weather={weatherData} />
      <Timeline days={timelineDays} />
    </div>
  );
}