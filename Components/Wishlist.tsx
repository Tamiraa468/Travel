"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Heart } from "lucide-react";

// Types
type Tour = {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  mainImage?: string | null;
  days: number;
};

type WishlistContextType = {
  wishlist: Tour[];
  addToWishlist: (tour: Tour) => void;
  removeFromWishlist: (tourId: string) => void;
  isInWishlist: (tourId: string) => boolean;
  clearWishlist: () => void;
};

// Context
const WishlistContext = createContext<WishlistContextType | null>(null);

// Provider Component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Tour[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("maralgoo_wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("maralgoo_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (tour: Tour) => {
    setWishlist((prev) => {
      if (prev.some((t) => t.id === tour.id)) return prev;
      return [...prev, tour];
    });
  };

  const removeFromWishlist = (tourId: string) => {
    setWishlist((prev) => prev.filter((t) => t.id !== tourId));
  };

  const isInWishlist = (tourId: string) => {
    return wishlist.some((t) => t.id === tourId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Hook
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

// Wishlist Button Component
type WishlistButtonProps = {
  tour: Tour;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

export function WishlistButton({
  tour,
  size = "md",
  showText = false,
  className = "",
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const inWishlist = isInWishlist(tour.id);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWishlist) {
      removeFromWishlist(tour.id);
    } else {
      addToWishlist(tour);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        sizeClasses[size]
      } rounded-full flex items-center justify-center transition-all duration-300 ${
        inWishlist
          ? "bg-red-50 text-red-500"
          : "bg-white/80 text-gray-500 hover:text-red-500"
      } ${isAnimating ? "scale-125" : "scale-100"} ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          inWishlist ? "fill-current" : ""
        }`}
      />
      {showText && (
        <span className="ml-2 text-sm">{inWishlist ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

// Wishlist Counter (for navbar)
export function WishlistCounter() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
      {wishlist.length}
    </span>
  );
}
