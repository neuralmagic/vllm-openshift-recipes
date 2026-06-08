import Link from 'next/link';
import { getAllRecipes } from '@/lib/recipes';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
  const recipes = getAllRecipes();

  return (
    <div className="space-y-12">
      <section className="space-y-4 pt-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Deploy LLMs on OpenShift
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
          Copy-paste deployment manifests for running open-weight models with
          vLLM on OpenShift. Pick a model, choose a variant, and{' '}
          <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm font-mono">
            oc apply -f
          </code>
          .
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {recipes.length === 0 ? 'No recipes yet' : `Latest recipes`}
          </h2>
          {recipes.length > 8 && (
            <Link
              href="/browse"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all {recipes.length} &rarr;
            </Link>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 9).map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
