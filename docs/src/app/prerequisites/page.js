import Link from 'next/link';

export const metadata = {
  title: 'Prerequisites | vLLM on OpenShift',
};

export default function Prerequisites() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Home
        </Link>
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Prerequisites</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need before deploying a model recipe.
        </p>
      </header>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. OpenShift Cluster</h2>
        <p className="text-muted-foreground">
          You need an OpenShift 4.14+ cluster with cluster-admin access. The
          recipes generate Kubernetes custom resources (ServingRuntime and
          InferenceService) that require an inference platform to be installed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. NVIDIA GPU Operator</h2>
        <p className="text-muted-foreground">
          Your cluster must have GPU-enabled worker nodes with the{' '}
          <a
            href="https://docs.nvidia.com/datacenter/cloud-native/openshift/latest/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            NVIDIA GPU Operator
          </a>{' '}
          installed. This exposes{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            nvidia.com/gpu
          </code>{' '}
          as a schedulable resource. Each recipe specifies how many GPUs and how
          much VRAM is required.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Red Hat OpenShift AI (RHOAI)</h2>
        <p className="text-muted-foreground">
          Install the{' '}
          <a
            href="https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Red Hat OpenShift AI
          </a>{' '}
          operator from OperatorHub. This provides KServe and the model serving
          stack that the ServingRuntime and InferenceService manifests target.
          Alternatively, you can install KServe standalone.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. vLLM Serving Runtime Image</h2>
        <p className="text-muted-foreground">
          The recipes use{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            quay.io/modh/vllm:latest
          </code>{' '}
          as the default container image. This image ships vLLM pre-installed
          and is maintained by Red Hat. Your cluster nodes need to be able to
          pull from{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            quay.io
          </code>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. HuggingFace Access (for gated models)</h2>
        <p className="text-muted-foreground">
          Some models (Llama, Mistral, etc.) are gated on HuggingFace and
          require you to accept the license and provide an access token. Create
          a Kubernetes secret with your token:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono leading-relaxed">
{`oc create secret generic hf-token \\
  --from-literal=HF_TOKEN=hf_your_token_here`}
        </pre>
        <p className="text-muted-foreground">
          Then reference it in the InferenceService. Open-weight models like
          Gemma 4 and Mistral Small don&apos;t require this.
        </p>
      </section>

      <hr className="border-border" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick Check</h2>
        <p className="text-muted-foreground">
          Verify your cluster is ready:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono leading-relaxed">
{`# GPUs visible?
oc get nodes -l nvidia.com/gpu.present=true

# RHOAI installed?
oc get csv -n redhat-ods-operator | grep rhods

# Can schedule GPUs?
oc describe node <gpu-node> | grep nvidia.com/gpu`}
        </pre>
      </section>
    </div>
  );
}
