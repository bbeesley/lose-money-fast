import { NewSpotOrderParams } from 'binance';
import { number } from 'mathjs';
import { OrderResponseFull } from './@types';
import { getClient } from './binance-client';

const client = getClient();

export async function placeOrder(
  orderParams: NewSpotOrderParams,
): Promise<OrderResponseFull> {
  const res = (await client.submitNewOrder(orderParams)) as OrderResponseFull;
  console.info('placed order', JSON.stringify(res, null, 2));
  return {
    ...res,
    price: res.fills[0].price,
    peakPrice: number(res.fills[0].price) as number,
  };
}
