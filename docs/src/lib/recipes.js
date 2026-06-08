import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const MODELS_DIR = path.join(process.cwd(), 'models');

export function getAllRecipes() {
  const recipes = [];
  if (!fs.existsSync(MODELS_DIR)) return recipes;

  for (const org of fs.readdirSync(MODELS_DIR)) {
    const orgDir = path.join(MODELS_DIR, org);
    if (!fs.statSync(orgDir).isDirectory()) continue;

    for (const file of fs.readdirSync(orgDir)) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
      const repo = file.replace(/\.ya?ml$/, '');
      const filePath = path.join(orgDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(raw);
      recipes.push({
        org,
        repo,
        slug: `${org}/${repo}`,
        ...data,
      });
    }
  }

  return recipes.sort(
    (a, b) => new Date(b.meta.date_updated) - new Date(a.meta.date_updated)
  );
}

export function getRecipe(org, repo) {
  const filePath = path.join(MODELS_DIR, org, `${repo}.yaml`);
  if (!fs.existsSync(filePath)) {
    const ymlPath = path.join(MODELS_DIR, org, `${repo}.yml`);
    if (!fs.existsSync(ymlPath)) return null;
    const raw = fs.readFileSync(ymlPath, 'utf8');
    return { org, repo, slug: `${org}/${repo}`, ...yaml.load(raw) };
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return { org, repo, slug: `${org}/${repo}`, ...yaml.load(raw) };
}

export function getAllRoutablePairs() {
  return getAllRecipes().map((r) => ({ org: r.org, repo: r.repo }));
}
