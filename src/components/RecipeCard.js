import Link from 'next/link';
import { cn, taskBadgeColor } from '@/lib/utils';

export default function RecipeCard({ recipe }) {
  const defaultVariant =
    recipe.variants.default || Object.values(recipe.variants)[0];

  return (
    <Link
      href={`/${recipe.org}/${recipe.repo}`}
      className="group block rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)]">
            {recipe.meta.provider}
          </p>
          <h3 className="font-semibold text-[var(--card-foreground)] group-hover:text-[var(--accent)] transition-colors">
            {recipe.meta.title}
          </h3>
        </div>
        <span className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-mono text-[var(--muted-foreground)]">
          {recipe.model.parameter_count}
        </span>
      </div>
      <p className="mb-3 text-sm text-[var(--muted-foreground)] line-clamp-2">
        {recipe.meta.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {recipe.meta.tasks.map((task) => (
          <span
            key={task}
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              taskBadgeColor(task)
            )}
          >
            {task}
          </span>
        ))}
        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-600 dark:text-gray-400">
          {defaultVariant.precision}
        </span>
        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
          {defaultVariant.min_gpus || 1} GPU{(defaultVariant.min_gpus || 1) > 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}
