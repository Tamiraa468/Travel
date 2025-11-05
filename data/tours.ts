// Shared canonical tour data used by both client and server to ensure
// consistent prices and metadata. Exporting this allows server-side
// verification of amounts when creating PaymentIntents.
export const TOURS = [
  {
    id: "gobi-001",
    title: "Gobi Desert Adventure",
    description:
      "Explore the vast dunes, camels, and nomadic lifestyle of the Gobi Desert.",
    price: 850,
    duration: "7 Days",
    imageKey: "gobi",
    location: "Gobi Desert, Mongolia",
  },
  {
    id: "khuvsgul-002",
    title: "Lake Khövsgöl Retreat",
    description:
      "Experience Mongolia's Blue Pearl — crystal lake and reindeer culture.",
    price: 950,
    duration: "6 Days",
    imageKey: "khuvsgul",
    location: "Khövsgöl Province, Mongolia",
  },
  {
    id: "terelj-003",
    title: "Terelj National Park Day Tour",
    description:
      "Visit Turtle Rock, Aryabal Temple, and enjoy traditional Mongolian food.",
    price: 150,
    duration: "1 Day",
    imageKey: "terelj",
    location: "Terelj National Park, Mongolia",
  },
];

export default TOURS;
