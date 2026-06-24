import fs from 'fs';
import path from 'path';

const PROVIDERS_DIR = path.join(process.cwd(), '..', 'public', 'providers');

let iconMap = null;

function getIconMap() {
  if (iconMap) return iconMap;
  iconMap = {};
  if (!fs.existsSync(PROVIDERS_DIR)) return iconMap;
  for (const file of fs.readdirSync(PROVIDERS_DIR)) {
    const name = file.replace(/\.(png|jpe?g|svg|webp)$/i, '');
    iconMap[name.toLowerCase()] = file;
  }
  return iconMap;
}

export function getProviderIconPath(org) {
  const map = getIconMap();
  const file = map[org.toLowerCase()];
  if (!file) return null;
  return `/vllm-openshift-recipes/providers/${file}`;
}

export default function ProviderIcon({ org, size = 20, className = '' }) {
  const src = getProviderIconPath(org);
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`inline-block rounded-sm object-contain ${className}`}
    />
  );
}
