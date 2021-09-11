import { SymbolPrice } from 'binance';
import { getClient } from './binance-client';
import { PAIRING } from './config';
import { alreadyTraded } from './data-store';

let coinList: string[] = [];

async function getCoinList() {
  const client = getClient();
  const coins = (await client.getSymbolPriceTicker()) as SymbolPrice[];
  return coins
    .map((c) => c.symbol)
    .filter((c) => c.endsWith(PAIRING))
    .sort((a, b) => a.localeCompare(b));
}

export async function getNewCoins(): Promise<string[]> {
  if (coinList.length === 0) {
    coinList = await getCoinList();
    return [];
  }
  const latestCoinList = await getCoinList();
  const newCoins = latestCoinList.filter(
    (c) => !coinList.includes(c) && !alreadyTraded(c),
  );
  coinList = latestCoinList;
  return newCoins;
}
