import { numberInString } from 'binance';

export function toFloat(value: numberInString): number {
  return typeof value === 'string' ? parseFloat(value) : value;
}
