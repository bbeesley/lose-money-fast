import { MainClient } from 'binance';

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const client = new MainClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export function getClient(): MainClient {
  return client;
}
