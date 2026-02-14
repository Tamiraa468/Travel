"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Trash2, X } from "lucide-react";
import AdminCard from "@/Components/AdminCard";
import ImageUpload from "@/Components/ImageUpload";

const BlogCategories = [
  { value: "NEWS", label: "News" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "TRAVEL_GUIDE", label: "Travel Guide" },
  { value: "CULTURE", label: "Culture" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "TIPS", label: "Tips" },
];

type Props = { params: { slug: string } };

export default function EditBlogPostPage({ params }: Props) {
  const router = useRouter();
  const { slug } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "NEWS",
    author: "",
    coverImage: "",
    tags: [] as string[],
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const post = await res.json();
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          category: post.category || "NEWS",
          author: post.author || "",
          coverImage: post.coverImage || "",
          tags: post.tags || [],
          isPublished: post.isPublished || false,
        });
      } else {
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (publish?: boolean) => {
    setSaving(true);

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublished: publish !== undefined ? publish : formData.isPublished,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        const updatedPost = payload?.data || payload;
        // If slug changed, redirect to new edit URL
        if (updatedPost.slug !== slug) {
          router.push(`/admin/blog/${updatedPost.slug}/edit`);
        } else {
          router.push("/admin/blog");
        }
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-500 mt-1">Update blog article</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Eye size={18} />
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-700 transition disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter post title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of the post"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                {previewMode ? (
                  <div
                    className="prose max-w-none p-4 border border-gray-200 rounded-lg min-h-[300px] bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your blog post content here... (HTML supported)"
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                )}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Status */}
          <AdminCard title="Status">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                {formData.isPublished ? "Published" : "Draft"}
              </span>
              <button
                onClick={() => handleSubmit(!formData.isPublished)}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition text-sm ${
                  formData.isPublished
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {formData.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
          </AdminCard>

          {/* Category & Author */}
          <AdminCard title="Details">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {BlogCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </AdminCard>

          {/* Featured Image */}
          <AdminCard title="Featured Image">
            {formData.coverImage ? (
              <div className="relative">
                <img
                  src={formData.coverImage}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() =>
                    setFormData({ ...formData, coverImage: "" })
                  }
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <ImageUpload
                label="Featured Image"
                value={formData.coverImage}
                onChange={(url: string) =>
                  setFormData({ ...formData, coverImage: url })
                }
              />
            )}
          </AdminCard>

          {/* Tags */}
          <AdminCard title="Tags">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gold-500/10 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-forest-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
