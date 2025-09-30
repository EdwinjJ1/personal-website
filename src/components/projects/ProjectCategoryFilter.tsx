'use client';

interface ProjectCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProjectCategoryFilterProps) {
  const filters = ['All', ...categories];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {filters.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            type="button"
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'border-teal-500 bg-teal-500/20 text-teal-200'
                : 'border-gray-700 text-gray-300 hover:border-teal-500/40 hover:text-white'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
