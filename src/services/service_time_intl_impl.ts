import type { TimeService } from "./service_time";

export class IntlTimeService implements TimeService {
  constructor() {
    this.userFormatter = new Intl.DateTimeFormat(navigator.language, {
      timeStyle: "short",
    });
  }

  private readonly userFormatter: Intl.DateTimeFormat;
  private readonly timezoneFormatters: Record<string, Intl.DateTimeFormat> = {};

  formatToTimezone(date: Date, timezone: string): string {
    return this.getFormatterForTimezone(timezone).format(date);
  }

  formatToUser(date: Date): string {
    return this.userFormatter.format(date);
  }

  private getFormatterForTimezone(timezone: string) {
    return (this.timezoneFormatters[timezone] ??= new Intl.DateTimeFormat(
      navigator.language,
      {
        timeStyle: "short",
        timeZone: timezone,
      }
    ));
  }
}
