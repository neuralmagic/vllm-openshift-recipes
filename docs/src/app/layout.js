import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'vLLM on OpenShift — Deployment Recipes',
  description:
    'Copy-paste OpenShift manifests for deploying LLMs with vLLM. New model? New recipe. oc apply and go.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          <div className="mx-auto max-w-6xl px-4">
            Built for day-zero model deployments on OpenShift.{' '}
            <a
              href="https://github.com/neuralmagic/vllm-openshift-recipes"
              className="underline hover:text-foreground"
            >
              Contribute a recipe
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
