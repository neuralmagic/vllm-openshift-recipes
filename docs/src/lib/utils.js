export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatParams(count) {
  return count;
}

export function taskBadgeColor(task) {
  switch (task) {
    case 'text':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'multimodal':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'embedding':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
}
