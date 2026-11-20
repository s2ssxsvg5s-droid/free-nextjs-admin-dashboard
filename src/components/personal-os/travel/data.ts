export const packingItems = [
  { id: "passport", checked: true },
  { id: "adapter", checked: true },
  { id: "headphones", checked: false },
  { id: "raincoat", checked: false },
  { id: "walkingShoes", checked: false },
] as const;

export const itinerary = [
  {
    day: "26",
    weekday: "thu",
    title: "arrival",
    detail: "arrivalDetail",
    time: "13:00",
  },
  {
    day: "27",
    weekday: "fri",
    title: "oldTown",
    detail: "oldTownDetail",
    time: "10:00",
  },
  {
    day: "28",
    weekday: "sat",
    title: "sintra",
    detail: "sintraDetail",
    time: "09:00",
  },
  {
    day: "29",
    weekday: "sun",
    title: "riverside",
    detail: "riversideDetail",
    time: "11:00",
  },
  {
    day: "30",
    weekday: "mon",
    title: "home",
    detail: "homeDetail",
    time: "15:30",
  },
] as const;
