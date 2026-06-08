import Link from 'next/link';
import { Box } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Box className="h-5 w-5 text-[var(--accent)]" />
          <span>vLLM on OpenShift</span>
          <span className="text-[var(--muted-foreground)]">/ recipes</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/browse"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Browse
          </Link>
          <a
            href="https://docs.vllm.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            vLLM Docs
          </a>
          <a
            href="https://github.com/redhat-et/vllm-openshift-recipes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
