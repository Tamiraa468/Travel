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
import TOURS from "@/data/tours";

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

// We'll map TOURS into the richer client-side shape when the client sets state.

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
        // Map the shared minimal TOURS data into the client-side Tour shape
        const mapped = TOURS.map((t) => ({
          ...t,
          // attach the actual image strings/objects from assets using the imageKey
          image:
            (assets as any).tourImages?.[t.imageKey as string] || t.imageKey,
        }));
        setTours(mapped as any);
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
