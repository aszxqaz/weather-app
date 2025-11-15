import { defineStore } from "pinia";
import { inject, ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import type { Location } from "../api/api_location";
import type { Weather, WeatherClient } from "../api/api_weather";
import { weatherClientKey } from "../injections";

export const useWeatherStore = defineStore("weather", () => {
  const weatherClient = inject<WeatherClient>(weatherClientKey)!;

  const { runAsync, loading, error } = useRequest(weatherClient.fetchWeather, {
    manual: true,
  });

  const weather = ref<Weather>();

  async function fetchWeather(location: Location) {
    weather.value = await runAsync(location);
  }

  return {
    error,
    loading,
    weather,
    fetchWeather,
  };
});
