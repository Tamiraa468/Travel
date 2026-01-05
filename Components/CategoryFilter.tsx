"use client";

import { useState, useEffect } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: { tours: number };
};

type Props = {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? "bg-forest-700 text-ivory"
            : "bg-sand text-forest-700 hover:bg-gold-500/10"
        }`}
      >
        All Tours
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-forest-700 text-ivory"
              : "bg-sand text-forest-700 hover:bg-gold-500/10"
          }`}
        >
          {category.name}
          {category._count && (
            <span className="ml-1 text-xs opacity-75">
              ({category._count.tours})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
