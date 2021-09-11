import {
  numberInString,
  OrderSide,
  OrderStatus,
  OrderTimeInForce,
  OrderType,
} from 'binance';

export interface OrderFill {
  price: numberInString;
  qty: numberInString;
  commission: numberInString;
  commissionAsset: string;
  tradeId?: number;
}

export interface OrderResponseFull {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: number;
  price: numberInString;
  origQty: numberInString;
  executedQty: numberInString;
  cummulativeQuoteQty: numberInString;
  status: OrderStatus;
  timeInForce: OrderTimeInForce;
  type: OrderType;
  side: OrderSide;
  fills: OrderFill[];
  peakPrice?: number;
}
