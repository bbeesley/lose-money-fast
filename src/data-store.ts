import { readFile, writeFile } from 'async-fs-wrapper';
import { statSync } from 'fs';
import { evaluate } from 'mathjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  CompletedTrades,
  OrderBook,
  OrderResponseFull,
  Orders,
} from './@types';
import { ORDERS_FILE } from './config';

let orders: Orders;
let completedTrades: CompletedTrades;

const __dirname = dirname(fileURLToPath(import.meta.url));

const pointer = resolve(__dirname, '../user_data', ORDERS_FILE);

async function saveState() {
  await writeFile(
    pointer,
    JSON.stringify({ orders, completedTrades }, null, 2),
  );
}

async function ensureDataStore() {
  if (!orders || !completedTrades) {
    try {
      statSync(pointer);
      console.info(`found order book at ${pointer}`);
      const jsonData = await readFile(pointer, { encoding: 'utf8' });
      const data = JSON.parse(jsonData) as OrderBook;
      orders = data.orders;
      completedTrades = data.completedTrades;
    } catch (err) {
      console.info('no orders file, creating empty order book');
      orders = {};
      completedTrades = {};
      await saveState();
    }
  }
}

export async function saveTrade(data: OrderResponseFull): Promise<void> {
  await ensureDataStore();
  orders[data.symbol] = data;
  await saveState();
}

export async function completeTrade(sell: OrderResponseFull): Promise<void> {
  await ensureDataStore();
  const buy = orders[sell.symbol];
  const roiBugNumber = evaluate(
    `( 100 * (${sell.cummulativeQuoteQty} - ${buy.cummulativeQuoteQty}) / ${buy.cummulativeQuoteQty})`,
  );
  const result = {
    stake: buy.cummulativeQuoteQty,
    return: sell.cummulativeQuoteQty,
    roi: `${roiBugNumber.toDecimalPlaces(2)}%`,
  };
  completedTrades[sell.symbol] = { buy, sell, result };
  delete orders[sell.symbol];
  await saveState();
}

export async function getOrders(): Promise<Record<string, OrderResponseFull>> {
  await ensureDataStore();
  return { ...orders };
}

export function alreadyTraded(symbol: string): boolean {
  const tradedPairs = [
    ...new Set([...Object.keys(orders), ...Object.keys(completedTrades)]),
  ];
  return tradedPairs.includes(symbol);
}
