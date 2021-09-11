import { number } from 'mathjs';
import { OrderResponseFull } from './@types';
import { getLivePrice } from './calculate-order';
import { SL, TSL } from './config';
import { saveTrade } from './data-store';

export async function shouldSell(order: OrderResponseFull): Promise<boolean> {
  const { price } = order;
  const originalPrice = number(price) as number;
  const peakPrice = order.peakPrice ?? originalPrice;
  const livePrice = await getLivePrice(order.symbol);
  if (livePrice > (peakPrice ?? originalPrice)) {
    console.info(`updating ${order.symbol} peak price to ${livePrice}`);
    await saveTrade({ ...order, peakPrice: livePrice });
    return false;
  }
  if (livePrice < originalPrice - originalPrice * SL) {
    console.info(
      `selling ${
        order.symbol
      } because current price of ${livePrice} is below the original price less stop loss value ${
        originalPrice - originalPrice * SL
      }`,
    );
    return true;
  }
  if (livePrice < peakPrice - peakPrice * TSL) {
    console.info(
      `selling ${
        order.symbol
      } because current price of ${livePrice} is below the peak price less trailing stop loss value ${
        peakPrice - peakPrice * TSL
      }`,
    );
    return true;
  }
  return false;
}
