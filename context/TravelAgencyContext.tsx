"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

// ---------------- Types ----------------
export type Traveler = {
  id: string;
  name: string;
  email: string;
  country: string;
  message?: string;
};

export type Tour = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image?: any; // Support for both StaticImageData and string/string[]
  location?: string;
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  included?: string[];
  notIncluded?: string[];
};

export type BookingRequest = {
  id: string;
  travelerId: string;
  tourId?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "rejected";
};

export type TravelAgencyContextType = {
  currency: string;
  router: ReturnType<typeof useRouter> | null;
  travelers: Traveler[];
  tours: Tour[];
  bookingRequests: BookingRequest[];
  fetchTours: () => Promise<void>;
  submitBookingRequest: (
    traveler: Omit<Traveler, "id">,
    tourId?: string
  ) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingRequest["status"]) => void;
};

// ---------------- Context ----------------
const TravelAgencyContext = createContext<TravelAgencyContextType | null>(null);

export const useTravelAgencyContext = () => {
  const ctx = useContext(TravelAgencyContext);
  if (!ctx)
    throw new Error(
      "useTravelAgencyContext must be used inside TravelAgencyProvider"
    );
  return ctx;
};

// ---------------- Dummy Data ----------------

const DUMMY_TOURS: Tour[] = [
  {
    id: "gobi-001",
    title: "Gobi Desert Adventure",
    description:
      "Explore the vast dunes, camels, and nomadic lifestyle of the Gobi Desert.",
    price: 850,
    duration: "7 Days",
    image: assets.tourImages.gobi,
    location: "Gobi Desert, Mongolia",
    highlights: [
      "Camel riding through sand dunes",
      "Visit to local nomadic families",
      "Explore ancient dinosaur fossils",
      "Sunset photography at the Singing Sands",
      "Traditional Mongolian barbecue dinner",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gobi",
        description:
          "Arrive in the Gobi region, meet your guide, and settle into your ger camp. Welcome dinner and orientation.",
      },
      {
        day: 2,
        title: "Sand Dunes Adventure",
        description:
          "Full day exploring the Khongoryn Els sand dunes with camel riding and photography opportunities.",
      },
      {
        day: 3,
        title: "Nomadic Culture",
        description:
          "Visit local families, learn about traditional nomadic lifestyle, and participate in daily activities.",
      },
      {
        day: 4,
        title: "Dinosaur Valley",
        description:
          "Explore famous dinosaur fossil sites and the Flaming Cliffs, with sunset viewing.",
      },
      {
        day: 5,
        title: "Desert Flora and Fauna",
        description:
          "Nature walk to observe desert wildlife and plants, evening star-gazing session.",
      },
      {
        day: 6,
        title: "Local Traditions",
        description:
          "Learn about Mongolian customs, try traditional archery, and enjoy a farewell dinner.",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Morning activities and departure with lasting memories of the Gobi Desert.",
      },
    ],
    included: [
      "Professional English-speaking guide",
      "All transportation during the tour",
      "Accommodation in ger camps",
      "All meals during the tour",
      "Entrance fees to protected areas",
      "Camel riding activities",
      "Traditional cultural performances",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages",
      "Gratuities",
    ],
  },
  {
    id: "khuvsgul-002",
    title: "Lake Khövsgöl Retreat",
    description:
      "Experience Mongolia's Blue Pearl — crystal lake and reindeer culture.",
    price: 950,
    duration: "6 Days",
    image: assets.tourImages.khuvsgul,
    location: "Khövsgöl Province, Mongolia",
    highlights: [
      "Boat trip on Lake Khövsgöl",
      "Meet Tsaatan reindeer herders",
      "Horseback riding through taiga forest",
      "Traditional shaman ceremony",
      "Lakeside camping experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to Khövsgöl",
        description:
          "Travel to Lake Khövsgöl, settle in at lakeside camp, evening welcome dinner.",
      },
      {
        day: 2,
        title: "Lake Exploration",
        description:
          "Boat trip on the crystal-clear waters, hiking along the shore, sunset photography.",
      },
      {
        day: 3,
        title: "Reindeer Herders",
        description:
          "Visit Tsaatan community, learn about their unique lifestyle with reindeer herds.",
      },
      {
        day: 4,
        title: "Taiga Adventure",
        description:
          "Horseback riding through the taiga forest, picnic lunch in nature.",
      },
      {
        day: 5,
        title: "Cultural Immersion",
        description:
          "Traditional shaman ceremony, local crafts workshop, farewell dinner.",
      },
      {
        day: 6,
        title: "Return Journey",
        description:
          "Morning by the lake, departure with memories of Mongolia's blue pearl.",
      },
    ],
    included: [
      "Expert local guide",
      "All transportation",
      "Lakeside accommodation",
      "All meals",
      "Boat trip fees",
      "Horse riding",
      "Cultural activities",
    ],
    notIncluded: [
      "Flights to/from Khövsgöl",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "Tips for guides",
    ],
  },
  {
    id: "terelj-003",
    title: "Terelj National Park Day Tour",
    description:
      "Visit Turtle Rock, Aryabal Temple, and enjoy traditional Mongolian food.",
    price: 150,
    duration: "1 Day",
    image: assets.tourImages.terelj,
    location: "Terelj National Park, Mongolia",
    highlights: [
      "Visit iconic Turtle Rock",
      "Hike to Aryabal Temple",
      "Traditional Mongolian lunch",
      "Short horse riding session",
      "Visit to nomad family",
    ],
    itinerary: [
      {
        day: 1,
        title: "Terelj Adventure",
        description:
          "Morning pickup from Ulaanbaatar, drive to Terelj National Park. Visit Turtle Rock, hike to Aryabal Temple, enjoy traditional lunch, meet local family, and return to the city by evening.",
      },
    ],
    included: [
      "Transportation from/to Ulaanbaatar",
      "English speaking guide",
      "Traditional lunch",
      "Entrance fees",
      "Short horse riding",
      "Bottled water",
    ],
    notIncluded: [
      "Additional snacks",
      "Optional activities",
      "Personal expenses",
      "Gratuities",
      "Travel insurance",
    ],
  },
];

// ---------------- Provider ----------------
export default function TravelAgencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);

  // Fetch tours (could be from API)
  const fetchTours = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTours(DUMMY_TOURS);
        resolve();
      }, 100);
    });
  };

  // Submit booking request & send mail
  const submitBookingRequest = async (
    traveler: Omit<Traveler, "id">,
    tourId?: string
  ) => {
    const newTraveler: Traveler = {
      id: Math.random().toString(36).slice(2),
      ...traveler,
    };
    setTravelers((prev) => [...prev, newTraveler]);

    const newBooking: BookingRequest = {
      id: Math.random().toString(36).slice(2),
      travelerId: newTraveler.id,
      tourId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setBookingRequests((prev) => [...prev, newBooking]);

    // send mail via API route
    try {
      await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traveler: newTraveler, tourId }),
      });
    } catch (error) {
      console.error("Email sending failed", error);
    }
  };

  const updateBookingStatus = (
    id: string,
    status: BookingRequest["status"]
  ) => {
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const value: TravelAgencyContextType = {
    currency,
    router,
    travelers,
    tours,
    bookingRequests,
    fetchTours,
    submitBookingRequest,
    updateBookingStatus,
  };

  return (
    <TravelAgencyContext.Provider value={value}>
      {children}
    </TravelAgencyContext.Provider>
  );
}
// ---------------- Example Components ----------------
export function TourCard({ tour }: { tour: Tour }) {
  const { currency, submitBookingRequest } = useTravelAgencyContext();
  const handleBook = () => {
    const traveler = {
      name: prompt("Your Name:") || "Guest",
      email: prompt("Your Email:") || "",
      country: prompt("Your Country:") || "",
      message: prompt("Message (optional):") || "",
    };
    submitBookingRequest(traveler, tour.id);
    alert("Booking request sent! We'll contact you soon.");
  };
  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold">{tour.title}</h3>
      <p className="text-sm text-gray-600">{tour.description}</p>
      <p className="mt-2 font-medium">
        {tour.price} {currency}
      </p>
      <p className="text-xs text-gray-500">{tour.duration}</p>
      <button
        onClick={handleBook}
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
      >
        Book Now
      </button>
    </div>
  );
}

export function BookingList() {
  const { bookingRequests, travelers, tours, updateBookingStatus } =
    useTravelAgencyContext();
  if (!bookingRequests.length) return <div>No booking requests yet.</div>;
  return (
    <div className="space-y-3">
      {bookingRequests.map((b) => {
        const t = travelers.find((x) => x.id === b.travelerId);
        const tour = tours.find((x) => x.id === b.tourId);
        return (
          <div key={b.id} className="p-3 border rounded">
            <p>
              <strong>{t?.name}</strong> from {t?.country}
            </p>
            <p className="text-sm">Tour: {tour?.title || "Custom Request"}</p>
            <p className="text-xs text-gray-500">Status: {b.status}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateBookingStatus(b.id, "confirmed")}
                className="text-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => updateBookingStatus(b.id, "rejected")}
                className="text-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
