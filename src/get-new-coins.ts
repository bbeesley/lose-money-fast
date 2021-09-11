import { SymbolPrice } from 'binance';
import { getClient } from './binance-client';
import { PAIRING } from './config';
import { alreadyTraded } from './data-store';

let coinList: string[] = [];

const client = getClient();

async function getCoinList() {
  const coins = (await client.getSymbolPriceTicker()) as SymbolPrice[];
  return coins
    .map((c) => c.symbol)
    .filter((c) => c.endsWith(PAIRING))
    .sort((a, b) => a.localeCompare(b));
}

export async function getRandomCoinPair(): Promise<string> {
  const coins = await getCoinList();
  return coins.sort(() => (Math.random() > 0.5 ? 1 : -1)).pop() as string;
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
