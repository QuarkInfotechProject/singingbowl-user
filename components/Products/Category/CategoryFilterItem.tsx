import { ChevronDown } from "lucide-react";
import { FilterCategoryItemProps } from "@/types/filter.types";

const FilterCategoryItem: React.FC<FilterCategoryItemProps> = ({
  category,
  selectedFilters,
  onFilterToggle,
  isExpanded,
  onToggleExpanded,
}) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{category.title}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 flex flex-col gap-3">
          {category.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(option.id)}
                onChange={() => onFilterToggle(option.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterCategoryItem;
