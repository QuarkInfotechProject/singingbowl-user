"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterSectionProps, FilterState } from "@/types/filter.types";
import FilterCategoryItem from "./CategoryFilterItem";

const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  resultsCount,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["category"])
  );

  const handleFilterToggle = (categoryId: string, optionId: string) => {
    setFilters((prev) => {
      const categoryFilters = prev[categoryId] || [];
      const updated = categoryFilters.includes(optionId)
        ? categoryFilters.filter((id) => id !== optionId)
        : [...categoryFilters, optionId];

      const newFilters =
        updated.length > 0 ? { ...prev, [categoryId]: updated } : { ...prev };

      delete newFilters[categoryId];
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleToggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const totalActiveFilters = Object.values(filters).flat().length;

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">Filters</span>
          {totalActiveFilters > 0 && (
            <span className="text-sm font-medium text-gray-600">
              ({totalActiveFilters})
            </span>
          )}
        </div>
        {totalActiveFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-0 text-sm font-medium"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 border-b border-gray-200">
        <span className="text-sm text-gray-600">
          {resultsCount} {resultsCount === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Filter Categories */}
      <div className="divide-y divide-gray-200">
        {categories.map((category) => (
          <FilterCategoryItem
            key={category.id}
            category={category}
            selectedFilters={filters[category.id] || []}
            onFilterToggle={(optionId) =>
              handleFilterToggle(category.id, optionId)
            }
            isExpanded={expandedCategories.has(category.id)}
            onToggleExpanded={() => handleToggleExpanded(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
