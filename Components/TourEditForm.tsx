/**
 * TourEditForm Component
 * A comprehensive form for editing all tour information
 * Includes dynamic array inputs, image management, and validation
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminInput from "@/Components/AdminInput";
import AdminButton from "@/Components/AdminButton";
import ImageUpload from "@/Components/ImageUpload";
import {
  Trash2,
  Plus,
  GripVertical,
  Save,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Eye,
  Image as ImageIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  meals: string;
  accommodation: string;
  highlights: string[];
}

interface PriceTier {
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  description: string;
}

interface TourFormData {
  title: string;
  slug: string;
  description: string;
  days: number;
  priceFrom: number;
  mainImage: string;
  images: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  mapEmbed: string;
  mapImage: string;
  season: string;
  groupSize: string;
  activityLevel: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
}

interface TourEditFormProps {
  tourId: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function TourEditForm({ tourId }: TourEditFormProps) {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    slug: "",
    description: "",
    days: 1,
    priceFrom: 0,
    mainImage: "",
    images: [],
    highlights: [],
    includes: [],
    excludes: [],
    mapEmbed: "",
    mapImage: "",
    season: "",
    groupSize: "",
    activityLevel: "",
    isActive: true,
    isFeatured: false,
    categoryId: "",
  });

  // Arrays state (managed separately for dynamic inputs)
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [includes, setIncludes] = useState<string[]>([""]);
  const [excludes, setExcludes] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);

  // Original data for change detection
  const [originalData, setOriginalData] = useState<string>("");

  // ============================================
  // FETCH TOUR DATA
  // ============================================
  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await fetch(`/api/admin/tours/${tourId}`);
        const result = await res.json();

        if (!result.ok) {
          setError(result.error || "Failed to load tour");
          return;
        }

        const tour = result.data;

        // Set form data
        setFormData({
          title: tour.title || "",
          slug: tour.slug || "",
          description: tour.description || "",
          days: tour.days || 1,
          priceFrom: tour.priceFrom || 0,
          mainImage: tour.mainImage || "",
          images: tour.images || [],
          highlights: tour.highlights || [],
          includes: tour.includes || [],
          excludes: tour.excludes || [],
          mapEmbed: tour.mapEmbed || "",
          mapImage: tour.mapImage || "",
          season: tour.season || "",
          groupSize: tour.groupSize || "",
          activityLevel: tour.activityLevel || "",
          isActive: tour.isActive ?? true,
          isFeatured: tour.isFeatured ?? false,
          categoryId: tour.categoryId || "",
        });

        // Set array states (add empty string if empty for UI)
        setHighlights(tour.highlights?.length ? tour.highlights : [""]);
        setIncludes(tour.includes?.length ? tour.includes : [""]);
        setExcludes(tour.excludes?.length ? tour.excludes : [""]);
        setImages(tour.images?.length ? tour.images : [""]);

        // Set itinerary
        if (tour.itinerary?.length) {
          setItinerary(
            tour.itinerary.map((day: any) => ({
              dayNumber: day.dayNumber,
              title: day.title || "",
              description: day.description || "",
              meals: day.meals || "",
              accommodation: day.accommodation || "",
              highlights: day.highlights?.length ? day.highlights : [],
            })),
          );
        } else {
          // Initialize itinerary based on days
          initializeItinerary(tour.days || 1);
        }

        // Set price tiers
        if (tour.priceTiers?.length) {
          setPriceTiers(
            tour.priceTiers.map((tier: any) => ({
              minPax: tier.minPax,
              maxPax: tier.maxPax,
              pricePerPerson: tier.pricePerPerson,
              description: tier.description || "",
            })),
          );
        } else {
          setPriceTiers([
            {
              minPax: 1,
              maxPax: 1,
              pricePerPerson: 0,
              description: "Solo traveler",
            },
          ]);
        }

        // Store original data for change detection
        setOriginalData(JSON.stringify(tour));
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError("Failed to load tour data");
      } finally {
        setLoading(false);
      }
    }

    fetchTour();
  }, [tourId]);

  // ============================================
  // UNSAVED CHANGES WARNING
  // ============================================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Mark as having unsaved changes when data changes
  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
    setSuccess("");
  }, []);

  // ============================================
  // ITINERARY HELPERS
  // ============================================
  const initializeItinerary = (days: number) => {
    const newItinerary: ItineraryDay[] = Array.from(
      { length: days },
      (_, i) => ({
        dayNumber: i + 1,
        title: "",
        description: "",
        meals: "",
        accommodation: "",
        highlights: [],
      }),
    );
    setItinerary(newItinerary);
  };

  const handleDaysChange = (newDays: number) => {
    setFormData({ ...formData, days: newDays });
    markUnsaved();

    if (newDays > itinerary.length) {
      const additionalDays = Array.from(
        { length: newDays - itinerary.length },
        (_, i) => ({
          dayNumber: itinerary.length + i + 1,
          title: "",
          description: "",
          meals: "",
          accommodation: "",
          highlights: [],
        }),
      );
      setItinerary([...itinerary, ...additionalDays]);
    } else if (newDays < itinerary.length) {
      setItinerary(itinerary.slice(0, newDays));
    }
  };

  const updateItineraryDay = (
    index: number,
    field: keyof ItineraryDay,
    value: any,
  ) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
    markUnsaved();
  };

  const addItineraryHighlight = (dayIndex: number) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights.push("");
    setItinerary(updated);
    markUnsaved();
  };

  const updateItineraryHighlight = (
    dayIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights[highlightIndex] = value;
    setItinerary(updated);
    markUnsaved();
  };

  const removeItineraryHighlight = (
    dayIndex: number,
    highlightIndex: number,
  ) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights.splice(highlightIndex, 1);
    setItinerary(updated);
    markUnsaved();
  };

  // ============================================
  // PRICE TIER HELPERS
  // ============================================
  const addPriceTier = () => {
    const lastTier = priceTiers[priceTiers.length - 1];
    setPriceTiers([
      ...priceTiers,
      {
        minPax: lastTier ? lastTier.maxPax + 1 : 1,
        maxPax: lastTier ? lastTier.maxPax + 2 : 2,
        pricePerPerson: 0,
        description: "",
      },
    ]);
    markUnsaved();
  };

  const updatePriceTier = (
    index: number,
    field: keyof PriceTier,
    value: any,
  ) => {
    const updated = [...priceTiers];
    updated[index] = { ...updated[index], [field]: value };
    setPriceTiers(updated);
    markUnsaved();
  };

  const removePriceTier = (index: number) => {
    if (priceTiers.length > 1) {
      setPriceTiers(priceTiers.filter((_, i) => i !== index));
      markUnsaved();
    }
  };

  // ============================================
  // ARRAY FIELD HELPERS (Generic)
  // ============================================
  const createArrayHelpers = (
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
  ) => ({
    add: () => {
      setState([...state, ""]);
      markUnsaved();
    },
    update: (index: number, value: string) => {
      const updated = [...state];
      updated[index] = value;
      setState(updated);
      markUnsaved();
    },
    remove: (index: number) => {
      if (state.length > 1) {
        setState(state.filter((_, i) => i !== index));
        markUnsaved();
      }
    },
  });

  const highlightsHelpers = createArrayHelpers(highlights, setHighlights);
  const includesHelpers = createArrayHelpers(includes, setIncludes);
  const excludesHelpers = createArrayHelpers(excludes, setExcludes);
  const imagesHelpers = createArrayHelpers(images, setImages);

  // ============================================
  // FORM SUBMISSION
  // ============================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    // Client-side validation
    if (!formData.title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }
    if (!formData.slug.trim()) {
      setError("Slug is required");
      setSaving(false);
      return;
    }
    if (formData.days < 1) {
      setError("Days must be at least 1");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        highlights: highlights.filter(Boolean),
        includes: includes.filter(Boolean),
        excludes: excludes.filter(Boolean),
        images: images.filter(Boolean),
        itinerary: itinerary.map((day) => ({
          ...day,
          highlights: day.highlights.filter(Boolean),
        })),
        priceTiers: priceTiers.filter((tier) => tier.pricePerPerson > 0),
      };

      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!result.ok) {
        setError(result.error || "Failed to update tour");
        return;
      }

      setSuccess("Tour updated successfully!");
      setHasUnsavedChanges(false);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Error updating tour:", err);
      setError(err.message || "Failed to update tour");
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // DELETE TOUR
  // ============================================
  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete "${formData.title}"?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!result.ok) {
        setError(result.error || "Failed to delete tour");
        return;
      }

      router.push("/admin/tours");
    } catch (err: any) {
      console.error("Error deleting tour:", err);
      setError(err.message || "Failed to delete tour");
    } finally {
      setDeleting(false);
    }
  }

  // ============================================
  // SLUG GENERATOR
  // ============================================
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
    markUnsaved();
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading tour data...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tours"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Tour</h1>
            <p className="text-gray-500 text-sm mt-1">
              {formData.title || "Untitled"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Link */}
          {formData.slug && (
            <Link
              href={`/tours/${formData.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete Tour"}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span className="text-amber-800">You have unsaved changes</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================
            BASIC INFORMATION SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            📝 Basic Information
          </h2>

          <AdminInput
            label="Tour Title"
            value={formData.title}
            onChange={(v) => {
              setFormData({ ...formData, title: String(v) });
              markUnsaved();
            }}
            required
            placeholder="e.g., Gobi Desert Adventure"
          />

          <div className="flex gap-2 items-end mb-4">
            <div className="flex-1">
              <AdminInput
                label="Slug (URL-friendly)"
                value={formData.slug}
                onChange={(v) => {
                  setFormData({ ...formData, slug: String(v) });
                  markUnsaved();
                }}
                required
                placeholder="e.g., gobi-desert-adventure"
              />
            </div>
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 mb-4 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Generate from Title
            </button>
          </div>

          <AdminInput
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(v) => {
              setFormData({ ...formData, description: String(v) });
              markUnsaved();
            }}
            rows={5}
            placeholder="Detailed tour description..."
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Number of Days"
              type="number"
              value={formData.days}
              onChange={(v) => handleDaysChange(Number(v))}
              required
            />

            <AdminInput
              label="Price From ($)"
              type="number"
              value={formData.priceFrom}
              onChange={(v) => {
                setFormData({ ...formData, priceFrom: Number(v) });
                markUnsaved();
              }}
              required
            />
          </div>
        </div>

        {/* ============================================
            EXTRA INFO SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            ℹ️ Extra Information
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <AdminInput
              label="Best Season"
              value={formData.season}
              onChange={(v) => {
                setFormData({ ...formData, season: String(v) });
                markUnsaved();
              }}
              placeholder="e.g., June-September"
            />

            <AdminInput
              label="Group Size"
              value={formData.groupSize}
              onChange={(v) => {
                setFormData({ ...formData, groupSize: String(v) });
                markUnsaved();
              }}
              placeholder="e.g., 1-10 pax"
            />

            <AdminInput
              label="Activity Level"
              value={formData.activityLevel}
              onChange={(v) => {
                setFormData({ ...formData, activityLevel: String(v) });
                markUnsaved();
              }}
              placeholder="e.g., Moderate, Easy"
            />
          </div>

          {/* Map Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Tour Route Map
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You can either upload a map image or paste Google Maps embed code
            </p>

            {/* Map Image Upload */}
            <div className="mb-4">
              <ImageUpload
                label="Map Image (Recommended)"
                value={formData.mapImage}
                onChange={(url) => {
                  setFormData({ ...formData, mapImage: url });
                  markUnsaved();
                }}
              />
            </div>

            {/* Or divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Maps Embed */}
            <AdminInput
              label="Google Maps Embed Code"
              type="textarea"
              value={formData.mapEmbed}
              onChange={(v) => {
                setFormData({ ...formData, mapEmbed: String(v) });
                markUnsaved();
              }}
              rows={3}
              placeholder='<iframe src="https://maps.google.com/..."></iframe>'
            />
          </div>

          {/* Map Preview */}
          {(formData.mapImage || formData.mapEmbed) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Preview
              </label>
              {formData.mapImage ? (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.mapImage}
                    alt="Tour Route Map"
                    className="w-full h-auto"
                  />
                </div>
              ) : formData.mapEmbed ? (
                <div
                  className="rounded-lg overflow-hidden border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: formData.mapEmbed }}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* ============================================
            IMAGES SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Images
          </h2>

          {/* Main Image */}
          <div className="mb-6">
            <ImageUpload
              label="Main Image"
              value={formData.mainImage}
              onChange={(url) => {
                setFormData({ ...formData, mainImage: url });
                markUnsaved();
              }}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Gallery Images
              </label>
              <button
                type="button"
                onClick={imagesHelpers.add}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>

            <div className="space-y-3">
              {images.map((imageUrl, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) =>
                        imagesHelpers.update(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Image URL"
                    />
                  </div>

                  {/* Image Preview */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                      }}
                    />
                  )}

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => imagesHelpers.remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================
            HIGHLIGHTS / INCLUDES / EXCLUDES SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Tour Details
          </h2>

          {/* Highlights */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Tour Highlights ✨
              </label>
              <button
                type="button"
                onClick={highlightsHelpers.add}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      highlightsHelpers.update(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Stay in traditional ger camps"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => highlightsHelpers.remove(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                What's Included ✅
              </label>
              <button
                type="button"
                onClick={includesHelpers.add}
                className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {includes.map((include, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={include}
                    onChange={(e) =>
                      includesHelpers.update(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., All meals and accommodation"
                  />
                  {includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => includesHelpers.remove(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Excludes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                What's Excluded ❌
              </label>
              <button
                type="button"
                onClick={excludesHelpers.add}
                className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {excludes.map((exclude, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exclude}
                    onChange={(e) =>
                      excludesHelpers.update(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., International flights"
                  />
                  {excludes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => excludesHelpers.remove(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================
            PRICE TIERS SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              💰 Group Size Pricing
            </h2>
            <button
              type="button"
              onClick={addPriceTier}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {priceTiers.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-end p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Pax
                  </label>
                  <input
                    type="number"
                    value={tier.minPax}
                    onChange={(e) =>
                      updatePriceTier(index, "minPax", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={1}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Pax
                  </label>
                  <input
                    type="number"
                    value={tier.maxPax}
                    onChange={(e) =>
                      updatePriceTier(index, "maxPax", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={tier.minPax}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price/Person ($)
                  </label>
                  <input
                    type="number"
                    value={tier.pricePerPerson}
                    onChange={(e) =>
                      updatePriceTier(
                        index,
                        "pricePerPerson",
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) =>
                      updatePriceTier(index, "description", e.target.value)
                    }
                    placeholder="e.g., Small group discount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  {priceTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePriceTier(index)}
                      className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-3">
            💡 Tip: Price typically decreases as group size increases
          </p>
        </div>

        {/* ============================================
            ITINERARY SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🗓️ Day-by-Day Itinerary ({itinerary.length}{" "}
            {itinerary.length === 1 ? "day" : "days"})
          </h2>

          <div className="space-y-6">
            {itinerary.map((day, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Day {day.dayNumber}
                  </h3>
                </div>

                <div className="space-y-4">
                  <AdminInput
                    label="Day Title"
                    value={day.title}
                    onChange={(v) =>
                      updateItineraryDay(index, "title", String(v))
                    }
                    placeholder="e.g., Arrival in Ulaanbaatar"
                  />

                  <AdminInput
                    label="Description"
                    type="textarea"
                    value={day.description}
                    onChange={(v) =>
                      updateItineraryDay(index, "description", String(v))
                    }
                    rows={4}
                    placeholder="Detailed description of the day's activities..."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput
                      label="Meals Included"
                      value={day.meals}
                      onChange={(v) =>
                        updateItineraryDay(index, "meals", String(v))
                      }
                      placeholder="e.g., B/L/D or Breakfast, Lunch, Dinner"
                    />

                    <AdminInput
                      label="Accommodation"
                      value={day.accommodation}
                      onChange={(v) =>
                        updateItineraryDay(index, "accommodation", String(v))
                      }
                      placeholder="e.g., Ger Camp, Hotel"
                    />
                  </div>

                  {/* Day Highlights */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Day Highlights
                      </label>
                      <button
                        type="button"
                        onClick={() => addItineraryHighlight(index)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {day.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) =>
                              updateItineraryHighlight(
                                index,
                                hIndex,
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter highlight"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeItineraryHighlight(index, hIndex)
                            }
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {day.highlights.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No highlights added yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
            STATUS TOGGLES SECTION
            ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            ⚙️ Status & Settings
          </h2>

          <div className="space-y-4">
            {/* isActive Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="font-medium text-gray-800">Active Tour</label>
                <p className="text-sm text-gray-500">
                  When disabled, this tour won't appear on the public website
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, isActive: !formData.isActive });
                  markUnsaved();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* isFeatured Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="font-medium text-gray-800">
                  Featured Tour
                </label>
                <p className="text-sm text-gray-500">
                  Featured tours are highlighted on the homepage
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    isFeatured: !formData.isFeatured,
                  });
                  markUnsaved();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isFeatured ? "bg-amber-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isFeatured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ============================================
          STICKY SAVE BUTTON
          ============================================ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (
                    confirm(
                      "You have unsaved changes. Are you sure you want to leave?",
                    )
                  ) {
                    router.push("/admin/tours");
                  }
                } else {
                  router.push("/admin/tours");
                }
              }}
            >
              Cancel
            </AdminButton>

            <button
              type="submit"
              form="tour-edit-form"
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 bg-forest-700 text-ivory hover:bg-forest-900 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Tour"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
