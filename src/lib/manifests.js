function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 63);
}

export function generateManifests(recipe, variantKey = 'default') {
  const variant = recipe.variants[variantKey] || recipe.variants.default;
  const deployment = recipe.deployment || {};
  const modelId = variant.model_id || recipe.model.model_id;
  const name = slugify(recipe.repo);
  const runtimeName = `vllm-${name}`;

  const gpuCount = String(variant.min_gpus || 1);
  const image = deployment.image || 'quay.io/modh/vllm:latest';

  const args = [];
  args.push('--model', modelId);
  if (parseInt(gpuCount) > 1) {
    args.push('--tensor-parallel-size', gpuCount);
  }
  if (deployment.vllm_args) {
    args.push(...deployment.vllm_args);
  }
  if (variant.extra_args) {
    args.push(...variant.extra_args);
  }

  const envVars = { ...deployment.env, ...variant.extra_env };
  const envBlock = Object.entries(envVars)
    .map(([k, v]) => `        - name: ${k}\n          value: "${v}"`)
    .join('\n');

  const servingRuntime = `apiVersion: serving.kserve.io/v1alpha1
kind: ServingRuntime
metadata:
  name: ${runtimeName}
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
