export type Location = {
  id: number;
  name: string;
  country: string;
  timezone: string;
  latitude: string;
  longitude: string;
};

export interface LocationClient {
  searchLocation(query: string): Promise<Location[]>;
}

export class OpenMeteoLocationClient implements LocationClient {
  static baseUrl = "https://geocoding-api.open-meteo.com/v1";

  async searchLocation(query: string): Promise<Location[]> {
    query = encodeURIComponent(query);
    const res = await fetch(
      `${OpenMeteoLocationClient.baseUrl}/search?name=${query}&count=10&language=en&format=json`
    );
    const json = await res.json();
    if ("error" in json) {
      throw new Error(json.error.reason);
    }

    const locations = (json["results"] ?? []) as Location[];
    locations.sort((a, b) => (a.name < b.name ? -1 : 1));

    return locations.map((location) => ({
      country: location.country,
      timezone: location.timezone,
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
    }));
  }
}
