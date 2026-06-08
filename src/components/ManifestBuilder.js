'use client';

import { useState } from 'react';
import { generateManifests, getVariantOptions } from '@/lib/manifests';
import CopyButton from './CopyButton';

export default function ManifestBuilder({ recipe }) {
  const variants = getVariantOptions(recipe);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.key || 'default');

  const { servingRuntime, inferenceService, combined } = generateManifests(
    recipe,
    selectedVariant
  );
  const variant = variants.find((v) => v.key === selectedVariant) || variants[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold">Select Variant</h2>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.key}
              onClick={() => setSelectedVariant(v.key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                selectedVariant === v.key
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                  : 'border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              <span className="font-mono">{v.precision.toUpperCase()}</span>
              <span className="ml-2 text-xs opacity-75">
                {v.minGpus} GPU{v.minGpus > 1 ? 's' : ''} &middot; {v.vram}GB
              </span>
            </button>
          ))}
        </div>
        {variant && (
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {variant.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Deploy with oc apply</h2>
          <CopyButton text={combined} />
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Save the YAML below to a file and run{' '}
          <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-xs font-mono">
            oc apply -f deploy.yaml
          </code>
        </p>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              ServingRuntime
            </span>
            <CopyButton text={servingRuntime} className="text-[10px]" />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono leading-relaxed">
            {servingRuntime}
          </pre>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              InferenceService
            </span>
            <CopyButton text={inferenceService} className="text-[10px]" />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono leading-relaxed">
            {inferenceService}
          </pre>
        </div>
      </div>
    </div>
  );
}
