export interface Transaction {
  id: string;
  merchant: string;
  category:
    "home" | "food" | "bills" | "transport" | "subscriptions" | "travel";
  date: string;
  amount: number;
}

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    merchant: "Riverside Apartments",
    category: "home",
    date: "2026-11-01",
    amount: 1680,
  },
  {
    id: "tx-2",
    merchant: "Green Market",
    category: "food",
    date: "2026-11-18",
    amount: 386,
  },
  {
    id: "tx-3",
    merchant: "City Utilities",
    category: "bills",
    date: "2026-11-05",
    amount: 154,
  },
  {
    id: "tx-4",
    merchant: "Neighborhood cafés",
    category: "food",
    date: "2026-11-19",
    amount: 260,
  },
  {
    id: "tx-5",
    merchant: "Metro Pass",
    category: "transport",
    date: "2026-11-02",
    amount: 120,
  },
  {
    id: "tx-6",
    merchant: "Digital subscriptions",
    category: "subscriptions",
    date: "2026-11-03",
    amount: 80,
  },
  {
    id: "tx-7",
    merchant: "Lisbon Stay",
    category: "travel",
    date: "2026-11-12",
    amount: 500,
  },
];

export const cashflow = {
  months: ["jun", "jul", "aug", "sep", "oct", "nov"] as const,
  income: [6000, 6000, 6200, 6200, 6400, 6400],
  expenses: [3550, 3720, 3410, 3890, 3620, 3180],
};

export const budget = { income: 6400, spent: 3180, limit: 4000 };

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
