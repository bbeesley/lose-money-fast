import { NewSpotOrderParams, SymbolLotSizeFilter, SymbolPrice } from 'binance';
import { BigNumber, bignumber, multiply, number } from 'mathjs';

import { getClient } from './binance-client';
import { STAKE_AMOUNT } from './config';
import { toFloat } from './util';

const client = getClient();

async function getTradeQuantity(
  symbol: string,
  desiredCoins: number,
): Promise<number> {
  const marketData = await client.getExchangeInfo();
  const pairData = marketData.symbols.find((d) => d.symbol === symbol);
  const lotSizeData = pairData?.filters.find(
    (f) => f.filterType === 'LOT_SIZE',
  ) as SymbolLotSizeFilter | undefined;
  if (!lotSizeData) {
    throw new Error(`unable to find exchange data for pair ${symbol}`);
  }
  const stepSize = toFloat(lotSizeData.stepSize);
  if (!stepSize) {
    throw new Error(`unable to find step size data for pair ${symbol}`);
  }
  const numSteps = Math.floor(desiredCoins / stepSize);
  const quantity = number(
    multiply(bignumber(numSteps), bignumber(stepSize)) as BigNumber,
  ) as number;
  return quantity;
}

export async function getLivePrice(symbol: string): Promise<number> {
  const priceData = (await client.getSymbolPriceTicker({
    symbol,
  })) as SymbolPrice;
  const price = toFloat(priceData.price);
  return price;
}

export async function calculateBuy(
  symbol: string,
): Promise<NewSpotOrderParams> {
  const price = await getLivePrice(symbol);
  const desiredCoins = STAKE_AMOUNT / price;
  const quantity = await getTradeQuantity(symbol, desiredCoins);
  return {
    symbol,
    side: 'BUY',
    type: 'MARKET',
    quantity,
    newOrderRespType: 'FULL',
  };
}

export async function calculateSell(
  symbol: string,
  desiredCoins: number,
): Promise<NewSpotOrderParams> {
  const quantity = await getTradeQuantity(symbol, desiredCoins);
  return {
    symbol,
    side: 'SELL',
    type: 'MARKET',
    quantity,
    newOrderRespType: 'FULL',
  };
}
