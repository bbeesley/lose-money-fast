import { numberInString } from 'binance';
import { getClient } from './binance-client';
import { calculateBuy } from './calculate-order';
import { getRandomCoinPair } from './get-new-coins';

const client = getClient();

export function toFloat(value: numberInString): number {
  return typeof value === 'string' ? parseFloat(value) : value;
}

export async function healthCheck(): Promise<void> {
  const coinPair = await getRandomCoinPair();
  console.info(`got a random coin pair ${coinPair}`);
  const buyOrder = await calculateBuy(coinPair);
  console.info(
    `creating a test buy order for ${coinPair}`,
    JSON.stringify({ buyOrder }, null, 2),
  );
  const testResponse = await client.testNewOrder(buyOrder);
  console.info(
    'no errors from test order',
    JSON.stringify({ testResponse }, null, 2),
  );
}
