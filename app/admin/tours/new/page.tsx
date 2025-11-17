"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/Components/AdminInput";
import AdminButton from "@/Components/AdminButton";
import { createTour } from "@/lib/actions";

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
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTour(formData);
      router.push("/admin/tours");
    } catch (err: any) {
      setError(err.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Tour</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8"
      >
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
          onChange={(v) => setFormData({ ...formData, description: String(v) })}
          required
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Number of Days"
            type="number"
            value={formData.days}
            onChange={(v) => setFormData({ ...formData, days: Number(v) })}
            required
          />

          <AdminInput
            label="Price From ($)"
            type="number"
            value={formData.priceFrom}
            onChange={(v) => setFormData({ ...formData, priceFrom: Number(v) })}
            required
          />
        </div>

        <AdminInput
          label="Main Image URL"
          type="text"
          value={formData.mainImage}
          onChange={(v) => setFormData({ ...formData, mainImage: String(v) })}
        />

        <AdminInput
          label="Google Maps Embed Code"
          type="textarea"
          value={formData.mapEmbed}
          onChange={(v) => setFormData({ ...formData, mapEmbed: String(v) })}
          rows={3}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3">
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
