import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getRecipe, getAllRoutablePairs } from '@/lib/recipes';
import ManifestBuilder from '@/components/ManifestBuilder';
import { cn, taskBadgeColor } from '@/lib/utils';
import ProviderIcon from '@/components/ProviderIcon';

export const dynamicParams = false;

export async function generateStaticParams() {
  const pairs = getAllRoutablePairs();
  if (pairs.length === 0) {
    return [{ org: '_placeholder', repo: '_placeholder' }];
  }
  return pairs;
}

export async function generateMetadata({ params }) {
  const { org, repo } = await params;
  const recipe = getRecipe(org, repo);
  if (!recipe) return {};
  return {
    title: `${recipe.meta.title} — vLLM on OpenShift`,
    description: recipe.meta.description,
  };
}

export default async function RecipePage({ params }) {
  const { org, repo } = await params;
  const recipe = getRecipe(org, repo);
  if (!recipe) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/browse"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; All recipes
        </Link>
      </div>

      <header className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-medium text-accent">
          <ProviderIcon org={recipe.org} size={20} />
          {recipe.meta.provider}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {recipe.meta.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {recipe.meta.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded bg-muted px-2 py-1 font-mono">
            {recipe.model.parameter_count}
          </span>
          {recipe.model.architecture === 'moe' && (
            <span className="rounded bg-muted px-2 py-1 font-mono">
              {recipe.model.active_parameters} active
            </span>
          )}
          <span className="rounded bg-muted px-2 py-1 font-mono">
            {recipe.model.context_length.toLocaleString()} ctx
          </span>
          {recipe.meta.tasks.map((task) => (
            <span
              key={task}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                taskBadgeColor(task)
              )}
            >
              {task}
            </span>
          ))}
          <span className="text-muted-foreground">
            {recipe.model.architecture}
          </span>
        </div>
      </header>

      <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
        These manifests assume you have OpenShift with the GPU Operator and
        RHOAI/KServe installed.{' '}
        <Link href="/prerequisites" className="text-accent hover:underline">
          Check prerequisites &rarr;
        </Link>
      </div>

      <ManifestBuilder recipe={recipe} />

      {recipe.guide && (
        <>
          <hr className="border-border" />
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {recipe.guide}
            </ReactMarkdown>
          </article>
        </>
      )}
    </div>
  );
}
