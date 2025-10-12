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
            className={`rounded-full border px-4 py-2 text-sm transition-colors`}
            style={
              isActive
                ? { borderColor: '#7a9088', backgroundColor: 'rgba(122, 144, 136, 0.2)', color: '#7a9088' }
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
