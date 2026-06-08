function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 63);
}

export function generateManifests(recipe, variantKey = 'default', overrides = {}) {
  const variant = recipe.variants[variantKey] || recipe.variants.default;
  const deployment = recipe.deployment || {};
  const modelId = variant.model_id || recipe.model.model_id;
  const name = slugify(recipe.repo);
  const runtimeName = `vllm-${name}`;

  const gpuCount = String(overrides.gpuCount || variant.min_gpus || 1);
  const image = deployment.image || 'quay.io/modh/vllm:latest';
  const namespace = overrides.namespace || 'llm-serving';
  const maxModelLen = overrides.maxModelLen || null;

  const args = [];
  args.push('--model', modelId);
  if (parseInt(gpuCount) > 1) {
    args.push('--tensor-parallel-size', gpuCount);
  }
  if (deployment.vllm_args) {
    for (const arg of deployment.vllm_args) {
      if (maxModelLen && arg.startsWith('--max-model-len')) continue;
      args.push(arg);
    }
  }
  if (maxModelLen) {
    args.push(`--max-model-len=${maxModelLen}`);
  }
  if (variant.extra_args) {
    args.push(...variant.extra_args);
  }
  if (overrides.extraArgs) {
    args.push(...overrides.extraArgs.split(/\s+/).filter(Boolean));
  }

  const envVars = { ...deployment.env, ...variant.extra_env };
  const envBlock = Object.entries(envVars)
    .map(([k, v]) => `        - name: ${k}\n          value: "${v}"`)
    .join('\n');

  const servingRuntime = `apiVersion: serving.kserve.io/v1alpha1
kind: ServingRuntime
metadata:
  name: ${runtimeName}
  namespace: ${namespace}
  annotations:
    openshift.io/display-name: "${recipe.meta.title} (${variant.precision})"
spec:
  supportedModelFormats:
    - name: vLLM
      autoSelect: true
  containers:
    - name: kserve-container
      image: ${image}
      command:
        - python
        - -m
        - vllm.entrypoints.openai.api_server
      args:
${args.map((a) => `        - "${a}"`).join('\n')}
      resources:
        requests:
          cpu: "2"
          memory: 8Gi
          nvidia.com/gpu: "${gpuCount}"
        limits:
          cpu: "8"
          memory: 24Gi
          nvidia.com/gpu: "${gpuCount}"
      ports:
        - containerPort: 8000
          protocol: TCP${envBlock ? `\n      env:\n${envBlock}` : ''}`;

  const inferenceService = `apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: ${name}
  namespace: ${namespace}
  annotations:
    serving.kserve.io/deploymentMode: RawDeployment
spec:
  predictor:
    model:
      modelFormat:
        name: vLLM
      runtime: ${runtimeName}
      storageUri: hf://${modelId}`;

  return {
    servingRuntime,
    inferenceService,
    combined: `${servingRuntime}\n---\n${inferenceService}`,
  };
}

export function getVariantOptions(recipe) {
  return Object.entries(recipe.variants).map(([key, v]) => ({
    key,
    label:
      key === 'default'
        ? `${v.precision.toUpperCase()} (default)`
        : v.precision.toUpperCase(),
    precision: v.precision,
    minGpus: v.min_gpus || 1,
    vram: v.vram_minimum_gb,
    description: v.description,
  }));
}

export function getDefaultMaxModelLen(recipe) {
  const deployment = recipe.deployment || {};
  if (deployment.vllm_args) {
    for (const arg of deployment.vllm_args) {
      const match = arg.match(/--max-model-len[=\s]+(\d+)/);
      if (match) return match[1];
    }
  }
  return String(recipe.model.context_length);
}
