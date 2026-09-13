(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,8156,e=>{"use strict";var t=e.i(75839),r=e.i(52705);let s=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),a=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,r.createContext)({}),l=(0,r.forwardRef)(({color:e,size:t,strokeWidth:a,absoluteStrokeWidth:l,className:i="",children:c,iconNode:d,...m},p)=>{let{size:u=24,strokeWidth:x=2,absoluteStrokeWidth:g=!1,color:h="currentColor",className:f=""}=(0,r.useContext)(o)??{},b=l??g?24*Number(a??x)/Number(t??u):a??x;return(0,r.createElement)("svg",{ref:p,...n,width:t??u??n.width,height:t??u??n.height,stroke:e??h,strokeWidth:b,className:s("lucide",f,i),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(m)&&{"aria-hidden":"true"},...m},[...d.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(c)?c:[c]])}),i=(e,t)=>{let n=(0,r.forwardRef)(({className:n,...o},i)=>(0,r.createElement)(l,{ref:i,iconNode:t,className:s(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=a(e),n},c=i("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),d=i("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]),m=i("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),p=i("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]),u=[1,2,4,8],x=[4096,8192,16384,32768,65536,131072,262144];function g({selected:e,onClick:r,children:s,mono:a=!1}){return(0,t.jsx)("button",{onClick:r,className:`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${a?"font-mono":""} ${e?"border-accent bg-accent text-accent-foreground shadow-sm":"border-border bg-card text-card-foreground hover:border-accent/50 hover:bg-muted"}`,children:s})}e.s(["default",0,function({recipe:e}){let s=Object.entries(e.variants).map(([e,t])=>({key:e,label:"default"===e?`${t.precision.toUpperCase()} (default)`:t.precision.toUpperCase(),precision:t.precision,minGpus:t.min_gpus||1,vram:t.vram_minimum_gb,description:t.description})),[a,n]=(0,r.useState)(s[0]?.key||"default"),o=s.find(e=>e.key===a)||s[0],l=function(e){let t=e.deployment||{};if(t.vllm_args)for(let e of t.vllm_args){let t=e.match(/--max-model-len[=\s]+(\d+)/);if(t)return t[1]}return String(e.model.context_length)}(e),[i,h]=(0,r.useState)(o?.minGpus||1),[f,b]=(0,r.useState)(l),[v,y]=(0,r.useState)("llm-serving"),[j,k]=(0,r.useState)(""),[N,w]=(0,r.useState)(!1),[$,C]=(0,r.useState)(!1),[S,_]=(0,r.useState)(!1);async function L(e){await navigator.clipboard.writeText(e),_(!0),setTimeout(()=>_(!1),2e3)}let{combined:M}=function(e,t="default",r={}){let s=e.variants[t]||e.variants.default,a=e.deployment||{},n=s.model_id||e.model.model_id,o=e.repo.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,63),l=`vllm-${o}`,i=String(r.gpuCount||s.min_gpus||1),c=a.image||"quay.io/modh/vllm:latest",d=r.namespace||"llm-serving",m=r.maxModelLen||null,p=[];if(p.push("--model",n),parseInt(i)>1&&p.push("--tensor-parallel-size",i),a.vllm_args)for(let e of a.vllm_args)m&&e.startsWith("--max-model-len")||p.push(e);m&&p.push(`--max-model-len=${m}`),s.extra_args&&p.push(...s.extra_args),r.extraArgs&&p.push(...r.extraArgs.split(/\s+/).filter(Boolean));let u=Object.entries({...a.env,...s.extra_env}).map(([e,t])=>`        - name: ${e}
          value: "${t}"`).join("\n"),x=`apiVersion: serving.kserve.io/v1alpha1
kind: ServingRuntime
metadata:
  name: ${l}
  namespace: ${d}
  annotations:
    openshift.io/display-name: "${e.meta.title} (${s.precision})"
spec:
  supportedModelFormats:
    - name: vLLM
      autoSelect: true
  containers:
    - name: kserve-container
      image: ${c}
      command:
        - python
        - -m
        - vllm.entrypoints.openai.api_server
      args:
${p.map(e=>`        - "${e}"`).join("\n")}
      resources:
        requests:
          cpu: "2"
          memory: 8Gi
          nvidia.com/gpu: "${i}"
        limits:
          cpu: "8"
          memory: 24Gi
          nvidia.com/gpu: "${i}"
      ports:
        - containerPort: 8000
          protocol: TCP${u?`
      env:
${u}`:""}`,g=`apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: ${o}
  namespace: ${d}
  annotations:
    serving.kserve.io/deploymentMode: RawDeployment
spec:
  predictor:
    model:
      modelFormat:
        name: vLLM
      runtime: ${l}
      storageUri: hf://${n}`;return{servingRuntime:x,inferenceService:g,combined:`${x}
---
${g}`}}(e,a,{gpuCount:i,maxModelLen:f,namespace:v,extraArgs:j});return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("label",{className:"block text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:"Precision"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:s.map(e=>(0,t.jsxs)(g,{selected:a===e.key,onClick:()=>{var t;let r;return n(t=e.key),void((r=s.find(e=>e.key===t))&&h(r.minGpus))},children:[(0,t.jsx)("span",{className:"font-mono",children:e.precision.toUpperCase()}),(0,t.jsxs)("span",{className:"ml-2 opacity-60",children:[e.minGpus," GPU",e.minGpus>1?"s":""," · ",e.vram,"GB"]})]},e.key))}),o&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:o.description})]}),(0,t.jsx)("div",{className:"h-px bg-border"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("label",{className:"block text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:"GPUs"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:u.map(e=>(0,t.jsx)(g,{selected:i===e,onClick:()=>h(e),mono:!0,children:e},e))})]}),(0,t.jsx)("div",{className:"h-px bg-border"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("label",{className:"block text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:"Max Context Length"}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2",children:[x.map(e=>(0,t.jsx)(g,{selected:!N&&String(f)===String(e),onClick:()=>{w(!1),b(String(e))},mono:!0,children:e>=1024?`${Math.round(e/1024)}K`:String(e)},e)),(0,t.jsx)(g,{selected:N,onClick:()=>w(!0),children:"Custom"}),N&&(0,t.jsx)("input",{type:"text",inputMode:"numeric",value:f,onChange:e=>b(e.target.value.replace(/[^0-9]/g,"")),placeholder:"e.g. 524288",className:"w-32 rounded-full border border-accent bg-background px-4 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent"})]})]}),(0,t.jsx)("div",{className:"h-px bg-border"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("label",{className:"block text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:"Namespace"}),(0,t.jsx)("input",{type:"text",value:v,onChange:e=>y(e.target.value),className:"w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"})]}),(0,t.jsxs)("button",{onClick:()=>C(!$),className:"inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",children:[$?(0,t.jsx)(p,{className:"h-4 w-4"}):(0,t.jsx)(m,{className:"h-4 w-4"}),"Advanced options"]}),$&&(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"block text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:"Extra vLLM Args"}),(0,t.jsx)("input",{type:"text",value:j,onChange:e=>k(e.target.value),placeholder:"--enforce-eager --enable-chunked-prefill",className:"w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Space-separated flags appended to the vLLM args"})]})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-lg font-semibold",children:"Deploy with oc apply"}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Save to a file and run"," ",(0,t.jsx)("code",{className:"rounded bg-muted px-1.5 py-0.5 text-xs font-mono",children:"oc apply -f deploy.yaml"})]})]}),(0,t.jsx)("button",{onClick:()=>L(M),className:`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${S?"border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400":"border-border bg-card hover:bg-muted"}`,children:S?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d,{className:"h-4 w-4"}),"Copied!"]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c,{className:"h-4 w-4"}),"Copy manifest"]})})]}),(0,t.jsx)("pre",{className:"overflow-x-auto rounded-xl border border-border bg-muted p-5 text-sm font-mono leading-relaxed",children:M})]})]})}],8156)}]);