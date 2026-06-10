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
    <div className="flex flex-wrap items-center gap-2.5">
      {filters.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            type="button"
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
              isActive ? 'accent-text accent-soft-bg accent-border font-medium' : ''
            }`}
            style={
              isActive
                ? undefined
                : { borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }
            }
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
