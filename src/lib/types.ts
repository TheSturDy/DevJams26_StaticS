export type View = 'customer' | 'merchant' | 'attack' | 'learn';

export type Transaction = {
  id: string;
  merchant: string;
  emoji: string;
  category: string;
  amount: number;
  roundUp: number;
  date: string;
  time: string;
};

export const initialTransactions: Transaction[] = [
  { id: 't1', merchant: 'Brew Beans Cafe', emoji: '☕', category: 'Food', amount: 84, roundUp: 6, date: 'Today', time: '09:12' },
  { id: 't2', merchant: 'Metro Quick Mart', emoji: '🛒', category: 'Groceries', amount: 153, roundUp: 7, date: 'Today', time: '08:40' },
  { id: 't3', merchant: 'RideGo Cab', emoji: '🚕', category: 'Travel', amount: 47, roundUp: 3, date: 'Yesterday', time: '19:55' },
  { id: 't4', merchant: 'Spice Junction', emoji: '🍛', category: 'Food', amount: 218, roundUp: 2, date: 'Yesterday', time: '13:30' },
  { id: 't5', merchant: 'MediCare Pharma', emoji: '💊', category: 'Health', amount: 96, roundUp: 4, date: '27 Aug', time: '11:02' },
  { id: 't6', merchant: 'FlickHouse Cinema', emoji: '🎬', category: 'Fun', amount: 65, roundUp: 5, date: '26 Aug', time: '20:10' },
  { id: 't7', merchant: 'PowerFuel Station', emoji: '⛽', category: 'Fuel', amount: 192, roundUp: 8, date: '25 Aug', time: '17:45' },
];

export const roundUp = (amount: number): number => {
  const next = Math.ceil(amount / 10) * 10;
  return next - amount;
};
