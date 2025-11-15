import { defineStore } from "pinia";
import { inject, ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import type { Location, LocationClient } from "../api/api_location";
import { locationClientKey } from "../injections";

export const useLocationStore = defineStore("location", () => {
  const locationClient = inject<LocationClient>(locationClientKey)!;

  const { runAsync, loading, error } = useRequest(
    locationClient.searchLocation,
    {
      manual: true,
    }
  );

  let suggestedLocations = ref<Location[]>([]);
  let currentLocation = ref<Location>();

  async function searchLocation(query: string) {
    if (query.trim().length < 3) return;
    suggestedLocations.value = await runAsync(query);
  }

  watch(currentLocation, (l) => {
    console.log(l);
  });

  return {
    loading,
    error,
    currentLocation,
    suggestedLocations,
    searchLocation,
  };
});
