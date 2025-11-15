<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDebounceFn } from "vue-hooks-plus";
import Header from "./partials/Header.vue";
import { useLocationStore } from "./store/store_location";
import { useWeatherStore } from "./store/store_weather";
import LocationWidget from "./widgets/LocationWidget.vue";
import SearchInput from "./widgets/SearchInput.vue";
import WeatherSnapshotWidget from "./widgets/WeatherSnapshotWidget.vue";

const locationStore = useLocationStore();
const weatherStore = useWeatherStore();

const { run: searchLocationDebounced } = useDebounceFn(
  locationStore.searchLocation,
  {
    wait: 400,
    trailing: true,
  }
);

let query = ref("");

watch(query, searchLocationDebounced);

watch(
  () => locationStore.currentLocation,
  (location) => {
    if (!location) return;
    weatherStore.fetchWeather(location);
  }
);

const searchOptions = computed(() => {
  if (query.value.trim().length < 2) return [];
  return locationStore.suggestedLocations.map((location) => ({
    id: location.id,
    value: location,
    label: location.name,
  }));
});
</script>

<template>
  <div class="min-h-screen bg-blue-50">
    <Header :loading="locationStore.loading || weatherStore.loading">
      <div class="max-w-100">
        <SearchInput
          placeholder="City"
          v-model:query="query"
          v-model:value="locationStore.currentLocation"
          :options="searchOptions"
          :display-value="(location) => `${location.name}, ${location.country}`"
        />
      </div>
    </Header>
    <main class="pt-6 pb-12">
      <div class="constrained">
        <div v-if="locationStore.error || weatherStore.error" class="mb-4">
          <p v-if="locationStore.error" class="text-red-500">
            {{ `Failed to fetch location: ${locationStore.error.message}` }}
          </p>
          <p v-if="weatherStore.error" class="text-red-500">
            {{ `Failed to fetch weather: ${weatherStore.error.message}` }}
          </p>
        </div>
        <template
          v-if="
            locationStore.currentLocation &&
            weatherStore.weather?.forecast.length
          "
        >
          <div class="mb-8">
            <LocationWidget
              :location="locationStore.currentLocation"
              :time="weatherStore.weather.current.time"
            />
          </div>
          <div class="mb-8">
            <h2 class="mb-4">Current weather</h2>
            <div class="weather-grid">
              <WeatherSnapshotWidget
                v-if="weatherStore.weather"
                :weather="weatherStore.weather.current"
                :location="locationStore.currentLocation"
              />
            </div>
          </div>
          <div>
            <h2 class="mb-4">Forecast</h2>
            <div class="weather-grid">
              <WeatherSnapshotWidget
                v-for="weather in weatherStore.weather?.forecast"
                :weather="weather"
                :location="locationStore.currentLocation"
              />
            </div>
            <p class="text-sm italic mt-4">Forecast time in user timezone</p>
          </div>
        </template>
        <div v-else>
          <p class="italic">Nothing to display here yet...</p>
        </div>
      </div>
    </main>
  </div>
</template>
