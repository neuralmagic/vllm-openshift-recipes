import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const MODELS_DIR = path.join(process.cwd(), 'models');
const OUT_FILE = path.join(process.cwd(), 'public', 'models.json');

const REQUIRED_META = ['title', 'provider', 'description', 'date_updated', 'tasks'];
const REQUIRED_MODEL = ['model_id', 'architecture', 'parameter_count', 'active_parameters', 'context_length'];
const VALID_TASKS = ['text', 'multimodal', 'embedding', 'omni'];
const VALID_ARCH = ['dense', 'moe'];
const VALID_PRECISIONS = ['bf16', 'fp16', 'fp8', 'nvfp4', 'fp4', 'int4', 'int8', 'awq', 'gptq'];

let errors = 0;

function error(file, msg) {
  console.error(`  ERROR [${file}]: ${msg}`);
  errors++;
}

function validate(filePath, data) {
  const rel = path.relative(MODELS_DIR, filePath);

  if (!data.meta) { error(rel, 'missing "meta" section'); return false; }
  if (!data.model) { error(rel, 'missing "model" section'); return false; }
  if (!data.variants) { error(rel, 'missing "variants" section'); return false; }

  for (const field of REQUIRED_META) {
    if (!data.meta[field]) error(rel, `meta.${field} is required`);
  }
  for (const field of REQUIRED_MODEL) {
    if (data.model[field] === undefined) error(rel, `model.${field} is required`);
  }

  if (data.meta.tasks) {
    for (const t of data.meta.tasks) {
      if (!VALID_TASKS.includes(t)) error(rel, `invalid task "${t}"`);
    }
  }

  if (data.model.architecture && !VALID_ARCH.includes(data.model.architecture)) {
    error(rel, `invalid architecture "${data.model.architecture}"`);
  }

  if (!data.variants.default) {
    error(rel, 'variants must include a "default" key');
  }

  for (const [key, v] of Object.entries(data.variants)) {
    if (!v.precision) error(rel, `variants.${key}.precision is required`);
    if (v.precision && !VALID_PRECISIONS.includes(v.precision)) {
      error(rel, `invalid precision "${v.precision}" in variants.${key}`);
    }
    if (v.vram_minimum_gb === undefined) error(rel, `variants.${key}.vram_minimum_gb is required`);
  }

  return errors === 0;
}

function run() {
  console.log('Building recipes API...\n');

  if (!fs.existsSync(MODELS_DIR)) {
    console.error('No models/ directory found');
    process.exit(1);
  }

  const recipes = [];

  for (const org of fs.readdirSync(MODELS_DIR).sort()) {
    const orgDir = path.join(MODELS_DIR, org);
    if (!fs.statSync(orgDir).isDirectory()) continue;

    for (const file of fs.readdirSync(orgDir).sort()) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;

      const filePath = path.join(orgDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');

      let data;
      try {
        data = yaml.load(raw);
      } catch (e) {
        error(file, `YAML parse error: ${e.message}`);
        continue;
      }

      validate(filePath, data);

      const repo = file.replace(/\.ya?ml$/, '');
      recipes.push({
        org,
        repo,
        slug: `${org}/${repo}`,
        title: data.meta.title,
        provider: data.meta.provider,
        description: data.meta.description,
        date_updated: data.meta.date_updated,
        tasks: data.meta.tasks,
        architecture: data.model.architecture,
        parameter_count: data.model.parameter_count,
        active_parameters: data.model.active_parameters,
        context_length: data.model.context_length,
        variants: Object.entries(data.variants).map(([key, v]) => ({
          key,
          precision: v.precision,
          min_gpus: v.min_gpus || 1,
          vram_minimum_gb: v.vram_minimum_gb,
        })),
      });
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} validation error(s) found. Fix them before building.`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(recipes, null, 2));

  console.log(`JSON API: ${recipes.length} models validated`);
  console.log(`  Written to ${path.relative(process.cwd(), OUT_FILE)}`);
}

run();
