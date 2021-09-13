import { numberInString } from 'binance';
import { OrderResponseFull } from './order-response-true';

export type Orders = Record<string, OrderResponseFull>;

export interface CompletedTrade {
  buy: OrderResponseFull;
  sell: OrderResponseFull;
  result: {
    stake: numberInString;
    returns: numberInString;
    profit: string;
    roi: string;
  };
}

export type CompletedTrades = Record<string, CompletedTrade>;

export interface OrderBook {
  orders: Orders;
  completedTrades: CompletedTrades;
}
