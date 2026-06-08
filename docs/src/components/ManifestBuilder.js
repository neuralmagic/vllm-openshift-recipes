'use client';

import { useState } from 'react';
import { generateManifests, getVariantOptions, getDefaultMaxModelLen } from '@/lib/manifests';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const GPU_OPTIONS = [1, 2, 4, 8];
const CTX_OPTIONS = [4096, 8192, 16384, 32768, 65536, 131072, 262144];

function formatCtx(n) {
  return n >= 1024 ? `${Math.round(n / 1024)}K` : String(n);
}

function Pill({ selected, onClick, children, mono = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
        mono ? 'font-mono' : ''
      } ${
        selected
          ? 'border-accent bg-accent text-accent-foreground shadow-sm'
          : 'border-border bg-card text-card-foreground hover:border-accent/50 hover:bg-muted'
      }`}
    >
      {children}
    </button>
  );
}

export default function ManifestBuilder({ recipe }) {
  const variants = getVariantOptions(recipe);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.key || 'default');
  const variant = variants.find((v) => v.key === selectedVariant) || variants[0];

  const defaultMaxLen = getDefaultMaxModelLen(recipe);
  const [gpuCount, setGpuCount] = useState(variant?.minGpus || 1);
  const [maxModelLen, setMaxModelLen] = useState(defaultMaxLen);
  const [namespace, setNamespace] = useState('llm-serving');
  const [extraArgs, setExtraArgs] = useState('');
  const [customCtx, setCustomCtx] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleVariantChange(key) {
    setSelectedVariant(key);
    const v = variants.find((v) => v.key === key);
    if (v) setGpuCount(v.minGpus);
  }

  async function handleCopy(text) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { combined } = generateManifests(
    recipe,
    selectedVariant,
    { gpuCount, maxModelLen, namespace, extraArgs }
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Precision
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <Pill
                key={v.key}
                selected={selectedVariant === v.key}
                onClick={() => handleVariantChange(v.key)}
              >
                <span className="font-mono">{v.precision.toUpperCase()}</span>
                <span className="ml-2 opacity-60">
                  {v.minGpus} GPU{v.minGpus > 1 ? 's' : ''} · {v.vram}GB
                </span>
              </Pill>
            ))}
          </div>
          {variant && (
            <p className="text-sm text-muted-foreground">{variant.description}</p>
          )}
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            GPUs
          </label>
          <div className="flex flex-wrap gap-2">
            {GPU_OPTIONS.map((n) => (
              <Pill key={n} selected={gpuCount === n} onClick={() => setGpuCount(n)} mono>
                {n}
              </Pill>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Max Context Length
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {CTX_OPTIONS.map((n) => (
              <Pill
                key={n}
                selected={!customCtx && String(maxModelLen) === String(n)}
                onClick={() => { setCustomCtx(false); setMaxModelLen(String(n)); }}
                mono
              >
                {formatCtx(n)}
              </Pill>
            ))}
            <Pill
              selected={customCtx}
              onClick={() => setCustomCtx(true)}
            >
              Custom
            </Pill>
            {customCtx && (
              <input
                type="text"
                inputMode="numeric"
                value={maxModelLen}
                onChange={(e) => setMaxModelLen(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 524288"
                className="w-32 rounded-full border border-accent bg-background px-4 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Namespace
          </label>
          <input
            type="text"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Extra vLLM Args
            </label>
            <input
              type="text"
              value={extraArgs}
              onChange={(e) => setExtraArgs(e.target.value)}
              placeholder="--enforce-eager --enable-chunked-prefill"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground">
              Space-separated flags appended to the vLLM args
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Deploy with oc apply</h2>
            <p className="text-sm text-muted-foreground">
              Save to a file and run{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                oc apply -f deploy.yaml
              </code>
            </p>
          </div>
          <button
            onClick={() => handleCopy(combined)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              copied
                ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-border bg-card hover:bg-muted'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy manifest
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-border bg-muted p-5 text-sm font-mono leading-relaxed">
          {combined}
        </pre>
      </div>
    </div>
  );
}
