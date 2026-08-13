import { getAllRecipes } from '@/lib/recipes';
import RecipeCard from '@/components/RecipeCard';
import ProviderIcon from '@/components/ProviderIcon';

export const metadata = {
  title: 'Browse Recipes | vLLM on OpenShift',
};

export default function Browse() {
  const recipes = getAllRecipes();
  const providers = [...new Set(recipes.map((r) => r.meta.provider))].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Recipes</h1>
        <p className="text-muted-foreground">
          {recipes.length} model{recipes.length !== 1 ? 's' : ''} ready for
          OpenShift deployment
        </p>
      </div>

      {providers.map((provider) => {
        const providerRecipes = recipes.filter(
          (r) => r.meta.provider === provider
        );
        const org = providerRecipes[0]?.org;
        return (
          <section key={provider} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ProviderIcon org={org} size={24} />
              {provider}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({providerRecipes.length})
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providerRecipes.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
