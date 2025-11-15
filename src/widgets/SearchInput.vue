<script
  setup
  lang="ts"
  generic="T extends string | number | boolean | object | null | undefined"
>
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";

type Option<T> = {
  id: string | number | symbol;
  value: T;
  label: string;
};

type Props<T> = {
  placeholder?: string;
  options: Option<T>[];
  displayValue: (value: T) => string;
};

const value = defineModel<T>("value");
defineProps<Props<T>>();
const query = defineModel<string>("query");
</script>

<template>
  <Combobox v-model="value">
    <div class="relative mt-1">
      <ComboboxInput
        autofocus
        spellcheck="false"
        autocomplete="off"
        :placeholder="placeholder"
        class="w-full border-none py-2 pl-3 pr-10 text-md leading-5 text-gray-900 bg-white shadow-white/20 shadow-sm outline-0 outline-offset-2 outline-white focus-visible:outline-2"
        @change="query = $event.target.value"
        :display-value="(v) => displayValue(v as T)"
      />

      <ComboboxOptions
        v-if="query && options.length"
        class="absolute top-[calc(100%+0.5rem)] max-h-60 w-full overflow-auto bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
      >
        <ComboboxOption
          v-for="option in options"
          as="template"
          :key="option.id"
          :value="option.value"
          v-slot="{ selected, active }"
        >
          <li
            class="relative cursor-pointer select-none py-2 pl-10 pr-4"
            :class="{
              'bg-blue-400 text-white': active,
              'text-gray-900': !active,
            }"
          >
            <span
              class="block truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
              {{ displayValue(option.value) }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{ 'text-white': active, 'text-teal-600': !active }"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
