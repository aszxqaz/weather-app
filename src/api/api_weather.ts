type Location = {
  latitude: string;
  longitude: string;
};

type WeatherCondition = "clear" | "rainy" | "cloudy" | "snowy";

export type WeatherSnapshot = {
  timezone: string;
  time: Date;
  temp: number;
  cond: WeatherCondition;
  units: string;
};

export type Weather = {
  timezone: string;
  forecast: WeatherSnapshot[];
  current: WeatherSnapshot;
};

export interface WeatherClient {
  fetchWeather(location: Location): Promise<Weather>;
}

export class OpenMeteoWeatherClient implements WeatherClient {
  static baseUrl = "https://api.open-meteo.com/v1";

  async fetchWeather(location: Location): Promise<Weather> {
    const res = await fetch(
      `${OpenMeteoWeatherClient.baseUrl}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=weather_code,temperature_2m&current=temperature_2m,weather_code&forecast_days=2`
    );
    const json = await res.json();
    if ("error" in json) {
      throw new Error(json.error.reason);
    }

    const currentJson = json["current"];

    const current: WeatherSnapshot = {
      timezone: json["timezone"],
      temp: currentJson["temperature_2m"],
      cond: fromWeatherCodeToCondition(currentJson["weather_code"]),
      units: json["current_units"]["temperature_2m"],
      time: new Date(currentJson["time"] + "Z"),
    };
    let times = json["hourly"]["time"] as string[];
    const temps = json["hourly"]["temperature_2m"];
    const codes = json["hourly"]["weather_code"];

    const forecast: WeatherSnapshot[] = times
      .map((time, i) => ({
        timezone: json["timezone"],
        temp: temps[i],
        cond: fromWeatherCodeToCondition(codes[i]),
        units: json["hourly_units"]["temperature_2m"],
        time: new Date(time + "Z"),
      }))
      .filter((weather) => weather.time.getTime() > current.time.getTime())
      .filter((_, i) => i < 8);

    const result = {
      timezone: json["timezone"],
      current,
      forecast,
    };
    return result;
  }
}

function fromWeatherCodeToCondition(code: number): WeatherCondition {
  if (code == 0) return "clear";
  if (code <= 48) return "cloudy";
  if (code <= 70) return "rainy";
  if (code <= 77) return "snowy";
  if (code <= 82) return "rainy";
  if (code <= 86) return "snowy";
  return "rainy";
}
