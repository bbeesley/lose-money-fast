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
  const marketData = await client.getExchangeInfo();
  return coins
    .filter((symbol) => {
      const pairData = marketData.symbols.find((d) => d.symbol === symbol);
      return pairData?.status === 'TRADING';
    })
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .pop() as string;
}

export async function getNewCoins(): Promise<string[]> {
  if (coinList.length === 0) {
    coinList = await getCoinList();
    return [];
  }
  const latestCoinList = await getCoinList();
  const newCoins = latestCoinList.filter((c) => {
    return !coinList.includes(c) && !alreadyTraded(c);
  });
  if (newCoins.length > 0) {
    console.info('found new coins', JSON.stringify(newCoins, null, 2));
    const marketData = await client.getExchangeInfo();
    const newCoinsAvailableToTrade = newCoins.filter((symbol) => {
      const pairData = marketData.symbols.find((d) => d.symbol === symbol);
      return pairData?.status === 'TRADING';
    });
    if (newCoinsAvailableToTrade.length === newCoins.length) {
      coinList = latestCoinList;
    }
    return newCoins;
  }
  return newCoins;
}
