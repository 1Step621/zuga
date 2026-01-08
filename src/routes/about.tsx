import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import {
  TbArrowLeft,
  TbCircuitResistor,
  TbMathFunction,
  TbTarget,
  TbBolt,
  TbFileExport,
  TbBrush,
} from "solid-icons/tb";
import logo from "~/assets/zuga.svg";

export default function About() {
  return (
    <main class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <Title>Zuga - Yet another diagraming tool.</Title>

      {/* Decorative Background */}
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-200/30 blur-[120px]" />
        <div class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[100px]" />
        <div class="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-100/20 blur-[150px]" />
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Navigation */}
        <nav class="mb-16">
          <A
            href="/"
            class="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors group"
          >
            <TbArrowLeft class="group-hover:-translate-x-1 transition-transform" />
            <span>キャンバスに戻る</span>
          </A>
        </nav>

        {/* Hero Section */}
        <header class="text-center mb-16 md:mb-24">
          <div class="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-cyan-700 bg-cyan-100 rounded-full">
            Technical Drawing Redefined
          </div>
          <h1 class="text-4xl md:text-8xl font-black tracking-tighter mb-8 bg-linear-to-br from-slate-900 via-slate-800 to-cyan-700 bg-clip-text text-transparent">
            <img src={logo} alt="Zuga Logo" class="inline-block w-64 md:w-100 mb-4" />
          </h1>
          <p class="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            複雑な思考を、美しく、正確な図面へと。
          </p>
        </header>

        {/* Feature Grid */}
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 md:mb-32">
          <FeatureCard
            icon={<TbCircuitResistor size={32} />}
            title="精巧な回路素子"
            description="抵抗、コンデンサ、電源など、JIS規格に準拠した美しいシンボルをドラッグ&ドロップで自在に配置。"
          />
          <FeatureCard
            icon={<TbMathFunction size={32} />}
            title="KaTeX 統合"
            description="LaTeXの表現力をそのままに。複雑な数式や記号を、キャンバスのあらゆる場所に美しく配置可能です。"
          />
          <FeatureCard
            icon={<TbTarget size={32} />}
            title="スマートスナップ"
            description="ミリ単位の正確さを。高度な吸着アルゴリズムが、素早く、そして完璧な整列をサポートします。"
          />
          <FeatureCard
            icon={<TbBolt size={32} />}
            title="究極のレスポンス"
            description="SolidJSによる高速な描画。どんなに複雑な図面でも、あなたの思考を妨げることはありません。"
          />
          <FeatureCard
            icon={<TbFileExport size={32} />}
            title="ポータブルSVG"
            description="作成した図面はピュアなSVGとして出力。メタデータを保持するため、いつでも再編集が可能です。"
          />
          <FeatureCard
            icon={<TbBrush size={32} />}
            title="直感的なUI"
            description="シンプルで洗練されたインターフェース。誰もがすぐに使いこなせます。"
          />
        </section>

        {/* Vision Section */}
        <section class="mb-32 p-12 rounded-xl bg-linear-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative shadow-2xl">
          <div class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] -mr-32 -mt-32" />
          <div class="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl md:text-4xl font-bold mb-6">
                Yet another diagraming tool.
              </h2>
              <div class="space-y-4 text-slate-300 leading-relaxed text-lg">
                <p>
                  Zugaであなたの思考を形に。直感的なインターフェースと強力な機能を組み合わせ、複雑なアイデアや概念を、美しく正確な図面へと変換します。
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-32 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold">100%</div>
                  <div class="text-xs text-slate-400">Vector Based</div>
                </div>
              </div>
              <div class="h-32 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold">Fast</div>
                  <div class="text-xs text-slate-400">Performance</div>
                </div>
              </div>
              <div class="h-32 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center col-span-2">
                <div class="text-center">
                  <div class="text-2xl font-bold">Open Source</div>
                  <div class="text-xs text-slate-400">Community Driven</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <footer class="text-center pb-24">
          <A
            href="/"
            class="inline-flex items-center px-12 py-5 bg-cyan-700 text-white rounded-full font-bold text-lg hover:bg-cyan-600 hover:scale-105 active:scale-100 transition-all"
          >
            はじめる
          </A>
          <div class="mt-12 text-slate-400 text-sm">
            &copy; 2026 onestep621. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard(props: { icon: any; title: string; description: string }) {
  return (
    <div class="p-6 md:p-8 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
      <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0 absolute top-6 right-6 md:relative md:top-0 md:right-0">
        {props.icon}
      </div>
      <div class="pr-14 md:pr-0">
        <h3 class="text-lg md:text-xl font-bold mb-2 md:mb-3 text-slate-800">{props.title}</h3>
        <p class="text-slate-500 leading-relaxed text-sm md:text-base">{props.description}</p>
      </div>
    </div>
  );
}
