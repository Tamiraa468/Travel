"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/Components/AdminInput";
import AdminButton from "@/Components/AdminButton";
import ImageUpload from "@/Components/ImageUpload";
import { createTour } from "@/lib/actions";
import { Trash2, Plus, GripVertical } from "lucide-react";

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

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    days: 1,
    priceFrom: 0,
    mainImage: "",
    mapEmbed: "",
    season: "",
    groupSize: "",
    activityLevel: "",
  });

  // Tour-level arrays
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [includes, setIncludes] = useState<string[]>([""]);
  const [excludes, setExcludes] = useState<string[]>([""]);

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: "",
      description: "",
      meals: "",
      accommodation: "",
      highlights: [],
    },
  ]);

  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    {
      minPax: 1,
      maxPax: 1,
      pricePerPerson: 0,
      description: "Solo traveler",
    },
  ]);

  // Tour Highlights, Includes, Excludes functions
  const addHighlight = () => setHighlights([...highlights, ""]);
  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };
  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index));
    }
  };

  const addInclude = () => setIncludes([...includes, ""]);
  const updateInclude = (index: number, value: string) => {
    const updated = [...includes];
    updated[index] = value;
    setIncludes(updated);
  };
  const removeInclude = (index: number) => {
    if (includes.length > 1) {
      setIncludes(includes.filter((_, i) => i !== index));
    }
  };

  const addExclude = () => setExcludes([...excludes, ""]);
  const updateExclude = (index: number, value: string) => {
    const updated = [...excludes];
    updated[index] = value;
    setExcludes(updated);
  };
  const removeExclude = (index: number) => {
    if (excludes.length > 1) {
      setExcludes(excludes.filter((_, i) => i !== index));
    }
  };

  // Update itinerary when days change
  const handleDaysChange = (days: number) => {
    setFormData({ ...formData, days });

    if (days > itinerary.length) {
      const newDays = Array.from(
        { length: days - itinerary.length },
        (_, i) => ({
          dayNumber: itinerary.length + i + 1,
          title: "",
          description: "",
          meals: "",
          accommodation: "",
          highlights: [],
        }),
      );
      setItinerary([...itinerary, ...newDays]);
    } else if (days < itinerary.length) {
      setItinerary(itinerary.slice(0, days));
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
  };

  const addItineraryHighlight = (dayIndex: number) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights.push("");
    setItinerary(updated);
  };

  const updateItineraryHighlight = (
    dayIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights[highlightIndex] = value;
    setItinerary(updated);
  };

  const removeItineraryHighlight = (
    dayIndex: number,
    highlightIndex: number,
  ) => {
    const updated = [...itinerary];
    updated[dayIndex].highlights.splice(highlightIndex, 1);
    setItinerary(updated);
  };

  // Price Tier Functions
  const addPriceTier = () => {
    const lastTier = priceTiers[priceTiers.length - 1];
    setPriceTiers([
      ...priceTiers,
      {
        minPax: lastTier.maxPax + 1,
        maxPax: lastTier.maxPax + 2,
        pricePerPerson: 0,
        description: "",
      },
    ]);
  };

  const updatePriceTier = (
    index: number,
    field: keyof PriceTier,
    value: any,
  ) => {
    const updated = [...priceTiers];
    updated[index] = { ...updated[index], [field]: value };
    setPriceTiers(updated);
  };

  const removePriceTier = (index: number) => {
    if (priceTiers.length > 1) {
      setPriceTiers(priceTiers.filter((_, i) => i !== index));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTour({
        ...formData,
        highlights: highlights.filter(Boolean),
        includes: includes.filter(Boolean),
        excludes: excludes.filter(Boolean),
        itinerary,
        priceTiers: priceTiers.filter((tier) => tier.pricePerPerson > 0),
      });
      router.push("/admin/tours");
    } catch (err: any) {
      setError(err.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Tour</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Basic Information
          </h2>

          <AdminInput
            label="Tour Title"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: String(v) })}
            required
          />

          <AdminInput
            label="Slug (URL-friendly)"
            value={formData.slug}
            onChange={(v) => setFormData({ ...formData, slug: String(v) })}
            required
          />

          <AdminInput
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(v) =>
              setFormData({ ...formData, description: String(v) })
            }
            required
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Number of Days"
              type="number"
              value={formData.days}
              onChange={(v) => handleDaysChange(Number(v))}
              required
              min={1}
            />

            <AdminInput
              label="Price From ($)"
              type="number"
              value={formData.priceFrom}
              onChange={(v) =>
                setFormData({ ...formData, priceFrom: Number(v) })
              }
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <AdminInput
              label="Best Season"
              value={formData.season}
              onChange={(v) => setFormData({ ...formData, season: String(v) })}
              placeholder="e.g., June-September"
            />

            <AdminInput
              label="Group Size"
              value={formData.groupSize}
              onChange={(v) =>
                setFormData({ ...formData, groupSize: String(v) })
              }
              placeholder="e.g., 1-10 pax"
            />

            <AdminInput
              label="Activity Level"
              value={formData.activityLevel}
              onChange={(v) =>
                setFormData({ ...formData, activityLevel: String(v) })
              }
              placeholder="e.g., Moderate, Easy"
            />
          </div>

          <AdminInput
            label="Main Image URL"
            type="text"
            value={formData.mainImage}
            onChange={(v) => setFormData({ ...formData, mainImage: String(v) })}
          />

          <ImageUpload
            label="Or Upload Main Image from Desktop"
            value={formData.mainImage}
            onChange={(url) => setFormData({ ...formData, mainImage: url })}
          />

          <AdminInput
            label="Google Maps Embed Code"
            type="textarea"
            value={formData.mapEmbed}
            onChange={(v) => setFormData({ ...formData, mapEmbed: String(v) })}
            rows={3}
          />
        </div>

        {/* Tour Highlights, Includes, Excludes */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Tour Details
          </h2>

          {/* Highlights */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Tour Highlights ✨
              </label>
              <button
                type="button"
                onClick={addHighlight}
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
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Stay in traditional ger camps"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                What's Included ✅
              </label>
              <button
                type="button"
                onClick={addInclude}
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
                    onChange={(e) => updateInclude(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., All meals and accommodation"
                  />
                  {includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
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
                onClick={addExclude}
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
                    onChange={(e) => updateExclude(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., International flights"
                  />
                  {excludes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExclude(index)}
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

        {/* Price Tiers Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Group Size Pricing
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
                    required
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
                    required
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
                    required
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

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Day-by-Day Itinerary ({itinerary.length}{" "}
            {itinerary.length === 1 ? "day" : "days"})
          </h2>

          <div className="space-y-6">
            {itinerary.map((day, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
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
                    required
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
                    required
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Highlights
                    </label>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter highlight"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeItineraryHighlight(index, hIndex)
                            }
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addItineraryHighlight(index)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Highlight
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <div className="flex gap-3 bg-white rounded-lg shadow-md p-6">
          <AdminButton type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Tour"}
          </AdminButton>
          <AdminButton
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
