<script setup lang="ts">
import { computed, inject } from "vue";
import type { Location } from "../api/api_location";
import type { WeatherSnapshot } from "../api/api_weather";
import {
  type TimeService,
  timeServiceInjectionKey,
} from "../services/service_time";

type Props = {
  weather: WeatherSnapshot;
  location: Location;
};

const { weather } = defineProps<Props>();

const tempDisplay = computed(() => `${weather.temp} ${weather.units}`);

const timeService = inject<TimeService>(timeServiceInjectionKey)!;

const timeDisplay = computed(() => timeService.formatToUser(weather.time));
</script>

<template>
  <div class="py-4 bg-white shadow-sm shadow-blue-100 rounded-md">
    <div
      class="flex flex-col items-center gap-4 select-none pointer-events-none"
    >
      <div class="text-xl">
        {{ timeDisplay }}
      </div>
      <div class="w-12 h-12">
        <img
          v-if="weather.cond == 'clear'"
          src="../assets/wc_clear.svg"
          alt="Clear sky"
        />
        <img
          v-if="weather.cond == 'cloudy'"
          src="../assets/wc_cloudy.svg"
          alt="Cloudy sky"
        />
        <img
          v-if="weather.cond == 'snowy'"
          src="../assets/wc_snowy.svg"
          alt="Snowy sky"
        />
        <img
          v-if="weather.cond == 'rainy'"
          src="../assets/wc_rainy.svg"
          alt="Rainy sky"
        />
      </div>
      <div class="text-xl">
        {{ tempDisplay }}
      </div>
    </div>
  </div>
</template>
