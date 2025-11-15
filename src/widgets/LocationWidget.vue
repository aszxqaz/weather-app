<script setup lang="ts">
import { computed, inject } from "vue";
import {
  type TimeService,
  timeServiceInjectionKey,
} from "../services/service_time";

type Location = {
  name: string;
  country: string;
  timezone: string;
};

type Props = {
  location: Location;
  time: Date;
};

const { location, time } = defineProps<Props>();

const timeService = inject<TimeService>(timeServiceInjectionKey)!;

const locationDisplayName = computed(
  () => `${location.name}, ${location.country}`
);

const locationDisplayTime = computed(() =>
  timeService.formatToTimezone(time, location.timezone)
);

const userDisplayTime = computed(() => timeService.formatToUser(time));
</script>

<template>
  <h1 class="font-semibold text-lg mb-4">
    {{ locationDisplayName }}
  </h1>
  <div class="flex flex-wrap items-center gap-x-4">
    <p>Weather data on:</p>
    <div class="grid">
      <div class="flex items-center gap-2">
        <time class="text-xl">{{ locationDisplayTime }}</time>
        <span class="text-sm">(Location time)</span>
      </div>
      <div class="flex items-center gap-2">
        <time class="text-xl">{{ userDisplayTime }}</time>
        <span class="text-sm">(User time)</span>
      </div>
    </div>
  </div>
</template>
