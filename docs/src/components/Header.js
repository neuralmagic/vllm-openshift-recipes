import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/openshift-icon.png" alt="OpenShift" width={24} height={24} />
          <span>vLLM on OpenShift</span>
          <span className="text-muted-foreground">/ recipes</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/browse"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/prerequisites"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Prerequisites
          </Link>
          <a
            href="https://docs.vllm.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            vLLM Docs
          </a>
          <a
            href="https://github.com/neuralmagic/vllm-openshift-recipes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
