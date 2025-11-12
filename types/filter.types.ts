export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface FilterState {
  [key: string]: string[];
}

export interface FilterCategoryItemProps {
  category: FilterCategory;
  selectedFilters: string[];
  onFilterToggle: (optionId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface FilterSectionProps {
  categories: FilterCategory[];
  resultsCount: number;
  onFilterChange?: (filters: FilterState) => void;
}

export interface ProductPageProps {
  categories?: FilterCategory[];
  resultsCount?: number;
}
