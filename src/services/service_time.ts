export const timeServiceInjectionKey = Symbol();

export interface TimeService {
  formatToUser(date: Date): string;
  formatToTimezone(date: Date, timezone: string): string;
}
