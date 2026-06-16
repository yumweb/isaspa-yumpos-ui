export const familyCardDefaultPackage = [
  // { id: 1, balance: 6000, value: 5000, expiry: 1, name: "Pearl (Rs. 5000/-)" },
  {
    id: 2,
    balance: 13000,
    value: 10000,
    expiry: 3,
    name: "Silver (Rs. 10000/-)",
  },
  {
    id: 3,
    balance: 20000,
    value: 15000,
    expiry: 6,
    name: "Gold (Rs. 15000/-)",
  },
  {
    id: 4,
    balance: 30000,
    value: 20000,
    expiry: 9,
    name: "Diamond (Rs. 20000/-)",
  },
  {
    id: 5,
    balance: 50000,
    value: 30000,
    expiry: 12,
    name: "Platinum (Rs. 30000/-)",
  },
];

// Time-based family card packages (balance tracked in minutes via serviceTime).
// price (value, ₹) -> serviceTime (minutes) -> expiry (months). From the legacy
// Isa Spa packages: 5000/3h/2mo … 50000/45h/12mo.
export const familyCardTimePackage = [
  { id: 1, value: 5000, serviceTime: 180, expiry: 2, name: "Simple" },
  { id: 2, value: 10000, serviceTime: 420, expiry: 3, name: "Perfect Bliss" },
  { id: 3, value: 15000, serviceTime: 660, expiry: 3, name: "Radiant Pearl" },
  { id: 4, value: 20000, serviceTime: 900, expiry: 6, name: "Splendid Silver" },
  { id: 5, value: 25000, serviceTime: 1200, expiry: 9, name: "Royal Gold" },
  { id: 6, value: 50000, serviceTime: 2700, expiry: 12, name: "Majestic Platinum" },
];
