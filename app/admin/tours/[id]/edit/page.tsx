"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/Components/AdminInput";
import AdminButton from "@/Components/AdminButton";
import ImageUpload from "@/Components/ImageUpload";
import {
  getTourById,
  updateTour,
  createTourDate,
  deleteTourDate,
} from "@/lib/actions";

export default function EditTourPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const [newDate, setNewDate] = useState({
    startDate: "",
    endDate: "",
    capacity: 10,
  });

  useEffect(() => {
    async function loadTour() {
      try {
        const data = await getTourById(params.id);
        setTour(data);
        setFormData(data);
      } catch (err) {
        setError("Failed to load tour");
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateTour(params.id, formData);
      router.push("/admin/tours");
    } catch (err: any) {
      setError(err.message || "Failed to update tour");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await createTourDate(params.id, newDate);
      const updatedTour = await getTourById(params.id);
      setTour(updatedTour);
      setNewDate({ startDate: "", endDate: "", capacity: 10 });
    } catch (err: any) {
      setError(err.message || "Failed to add date");
    }
  }

  async function handleDeleteDate(dateId: string) {
    if (!confirm("Are you sure?")) return;
    setError("");

    try {
      await deleteTourDate(dateId);
      const updatedTour = await getTourById(params.id);
      setTour(updatedTour);
    } catch (err: any) {
      setError(err.message || "Failed to delete date");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!tour) return <div>Tour not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Edit Tour</h1>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg shadow-md p-8 max-w-2xl"
      >
        <AdminInput
          label="Tour Title"
          value={formData?.title || ""}
          onChange={(v) => setFormData({ ...formData, title: v })}
        />

        <AdminInput
          label="Slug"
          value={formData?.slug || ""}
          onChange={(v) => setFormData({ ...formData, slug: v })}
        />

        <AdminInput
          label="Description"
          type="textarea"
          value={formData?.description || ""}
          onChange={(v) => setFormData({ ...formData, description: v })}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Days"
            type="number"
            value={formData?.days || 0}
            onChange={(v) => setFormData({ ...formData, days: v })}
          />

          <AdminInput
            label="Price From"
            type="number"
            value={formData?.priceFrom || 0}
            onChange={(v) => setFormData({ ...formData, priceFrom: v })}
          />
        </div>

        <ImageUpload
          label="Main Image"
          value={formData?.mainImage || ""}
          onChange={(url) => setFormData({ ...formData, mainImage: url })}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Tour"}
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

      {/* Tour Dates Management */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Available Dates
        </h2>

        <form
          onSubmit={handleAddDate}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="font-semibold mb-3">Add New Date</h3>

          <div className="grid grid-cols-3 gap-3">
            <AdminInput
              label="Start Date"
              type="datetime-local"
              value={newDate.startDate}
              onChange={(v) => setNewDate({ ...newDate, startDate: String(v) })}
              required
            />

            <AdminInput
              label="End Date"
              type="datetime-local"
              value={newDate.endDate}
              onChange={(v) => setNewDate({ ...newDate, endDate: String(v) })}
              required
            />

            <AdminInput
              label="Capacity"
              type="number"
              value={newDate.capacity}
              onChange={(v) => setNewDate({ ...newDate, capacity: Number(v) })}
              required
            />
          </div>

          <AdminButton type="submit" variant="primary" className="mt-3">
            Add Date
          </AdminButton>
        </form>

        {tour.dates && tour.dates.length > 0 ? (
          <div className="space-y-3">
            {tour.dates.map((date: any) => (
              <div
                key={date.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded"
              >
                <div>
                  <p className="font-medium">
                    {new Date(date.startDate).toLocaleDateString()} -{" "}
                    {new Date(date.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Capacity: {date.capacity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteDate(date.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No dates added yet</p>
        )}
      </div>
    </div>
  );
}
