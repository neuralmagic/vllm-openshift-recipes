# vLLM on OpenShift Deployment Recipes

Copy-paste OpenShift manifests for deploying open-weight LLMs with vLLM. New model? New recipe. `oc apply` and go.

## How it works

Each model gets a YAML recipe in `docs/models/<org>/<repo>.yaml`. Merge a PR to `main` and GitHub Actions builds the site with ready-to-use ServingRuntime + InferenceService manifests.

## Adding a recipe

1. Create `docs/models/<hf-org>/<hf-repo>.yaml` (see existing recipes for the format)
2. Run `pnpm validate` from `docs/` to check your YAML
3. Run `pnpm dev` from `docs/` to preview at http://localhost:3000
4. Open a PR and the site rebuilds on merge

## Development

```bash
cd docs
pnpm install
pnpm dev          # http://localhost:3000
pnpm validate     # check all recipe YAML files
pnpm build        # full static build to out/
```

## Recipe format

```yaml
meta:
  title: "Model Name"
  provider: "Org"
  description: "One-sentence summary"
  date_updated: 2026-06-08
  tasks: [text]

model:
  model_id: "org/model-name"
  architecture: dense        # dense | moe
  parameter_count: "8B"
  active_parameters: "8B"
  context_length: 131072

variants:
  default:
    precision: bf16
    min_gpus: 1
    vram_minimum_gb: 20
    description: "Full BF16 on a single GPU"

deployment:
  image: "quay.io/modh/vllm:latest"
  vllm_args:
    - "--max-model-len=32768"

guide: |
  ## Overview
  ...
```
