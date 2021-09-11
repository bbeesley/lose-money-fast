export const STAKE_AMOUNT = process.env.STAKE_AMOUNT
  ? parseFloat(process.env.STAKE_AMOUNT)
  : 15;
export const PAIRING = process.env.PAIRING ?? 'USDT';
export const RUN_EVERY = process.env.RUN_EVERY
  ? parseInt(process.env.RUN_EVERY, 10)
  : 300;
export const HEARTBEAT_MINUTES = process.env.HEARTBEAT_MINUTES
  ? parseInt(process.env.HEARTBEAT_MINUTES)
  : 1;
export const SL = process.env.SL ? parseFloat(process.env.SL) : 0.1;
export const TSL = process.env.TSL ? parseFloat(process.env.TSL) : 0.05;
export const ORDERS_FILE = 'order-book.json';
