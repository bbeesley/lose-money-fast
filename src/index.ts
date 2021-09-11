import delay from 'delay';
import { calculateBuy, calculateSell } from './calculate-order';
import { getNewCoins } from './get-new-coins';
import { completeTrade, getOrders, saveTrade } from './data-store';
import { placeOrder } from './trade';
import { healthCheck, toFloat } from './util';
import { shouldSell } from './calculate-position';
import { HEARTBEAT_MINUTES, RUN_EVERY } from './config';

const startTime = new Date();
let lastHeartbeat: number;

async function start(): Promise<void> {
  console.info('starting');
  while (true) {
    try {
      const openTrades = await getOrders();
      for (const [symbol, order] of Object.entries(openTrades)) {
        console.info('found open order', JSON.stringify(order, null, 2));
        const takeReturns = await shouldSell(order);
        if (takeReturns) {
          const sellOrder = await calculateSell(
            symbol,
            toFloat(order.executedQty),
          );
          console.info(`selling ${symbol}`, JSON.stringify(sellOrder));
          const receipt = await placeOrder(sellOrder);
          console.info(`sold ${symbol}`, JSON.stringify(receipt));
          await completeTrade(receipt);
        }
      }
      const newCoins = await getNewCoins();
      if (newCoins.length > 0) {
        console.info('found new coins', JSON.stringify(newCoins, null, 2));
        for (const coinPair of newCoins) {
          console.info(`purchasing ${coinPair}`);
          const buyOrder = await calculateBuy(coinPair);
          const receipt = await placeOrder(buyOrder);
          console.info(
            `purchased ${coinPair}`,
            JSON.stringify(receipt, null, 2),
          );
          await saveTrade(receipt);
        }
      }
      await delay(RUN_EVERY);
      if (
        !lastHeartbeat ||
        lastHeartbeat + 60e3 * HEARTBEAT_MINUTES < Date.now()
      ) {
        lastHeartbeat = Date.now();
        console.info('running healthcheck');
        healthCheck()
          .then(() => {
            const now = new Date();
            console.info(
              `successfully completed a run at ${now.toISOString()}, running since ${startTime.toISOString()}`,
            );
          })
          .catch((e) => {
            const now = new Date();
            console.error(
              `encountered an error while running healthcheck at ${now.toISOString()}`,
              e,
            );
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

start();
