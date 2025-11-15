import { createPinia } from "pinia";
import { createApp } from "vue";
import {
  OpenMeteoLocationClient,
  type LocationClient,
} from "./api/api_location";
import { OpenMeteoWeatherClient, type WeatherClient } from "./api/api_weather";
import App from "./App.vue";
import { locationClientKey, weatherClientKey } from "./injections";
import {
  timeServiceInjectionKey,
  type TimeService,
} from "./services/service_time";
import { IntlTimeService } from "./services/service_time_intl_impl";
import "./style.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.provide<LocationClient>(locationClientKey, new OpenMeteoLocationClient());
app.provide<WeatherClient>(weatherClientKey, new OpenMeteoWeatherClient());
app.provide<TimeService>(timeServiceInjectionKey, new IntlTimeService());

app.mount("#app");
