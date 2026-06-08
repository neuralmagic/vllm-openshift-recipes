'use client';

import { useState } from 'react';
import { generateManifests, getVariantOptions, getDefaultMaxModelLen } from '@/lib/manifests';
import CopyButton from './CopyButton';

const GPU_OPTIONS = [1, 2, 4, 8];
const CTX_OPTIONS = ['4096', '8192', '16384', '32768', '65536', '131072'];

export default function ManifestBuilder({ recipe }) {
  const variants = getVariantOptions(recipe);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.key || 'default');
  const variant = variants.find((v) => v.key === selectedVariant) || variants[0];

  const defaultMaxLen = getDefaultMaxModelLen(recipe);
  const [gpuCount, setGpuCount] = useState(variant?.minGpus || 1);
  const [maxModelLen, setMaxModelLen] = useState(defaultMaxLen);
  const [namespace, setNamespace] = useState('llm-serving');
  const [extraArgs, setExtraArgs] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleVariantChange(key) {
    setSelectedVariant(key);
    const v = variants.find((v) => v.key === key);
    if (v) setGpuCount(v.minGpus);
  }

  const { servingRuntime, inferenceService, combined } = generateManifests(
    recipe,
    selectedVariant,
    { gpuCount, maxModelLen, namespace, extraArgs }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold">Precision</h2>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.key}
              onClick={() => handleVariantChange(v.key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                selectedVariant === v.key
                  ? 'border-accent bg-accent text-white'
                  : 'border-border hover:border-accent'
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
          <p className="mt-2 text-sm text-muted-foreground">
            {variant.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            GPUs
          </label>
          <div className="flex gap-1">
            {GPU_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setGpuCount(n)}
                className={`flex-1 rounded-md border px-3 py-1.5 text-sm font-mono transition-all ${
                  gpuCount === n
                    ? 'border-accent bg-accent text-white'
                    : 'border-border hover:border-accent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Max Model Length
          </label>
          <select
            value={maxModelLen}
            onChange={(e) => setMaxModelLen(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono"
          >
            {CTX_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {parseInt(v).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Namespace
          </label>
          <input
            type="text"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? '- Hide' : '+ Show'} advanced options
        </button>
        {showAdvanced && (
          <div className="mt-3">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Extra vLLM Args
            </label>
            <input
              type="text"
              value={extraArgs}
              onChange={(e) => setExtraArgs(e.target.value)}
              placeholder="--enforce-eager --enable-chunked-prefill"
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Space-separated flags appended to the vLLM args
            </p>
          </div>
        )}
      </div>

      <hr className="border-border" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Deploy with oc apply</h2>
          <CopyButton text={combined} />
        </div>
        <p className="text-sm text-muted-foreground">
          Save the YAML below to a file and run{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            oc apply -f deploy.yaml
          </code>
        </p>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              ServingRuntime
            </span>
            <CopyButton text={servingRuntime} className="text-[10px]" />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono leading-relaxed">
            {servingRuntime}
          </pre>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              InferenceService
            </span>
            <CopyButton text={inferenceService} className="text-[10px]" />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono leading-relaxed">
            {inferenceService}
          </pre>
        </div>
      </div>
    </div>
  );
}
