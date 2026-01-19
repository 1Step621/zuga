import { thumbnails } from "~/logic/meta/thumbnails";
import { handStore } from "~/stores/handStore";
import { Kind, kinds } from "~/logic/kind";
import { createSignal, For, JSX, Match, Show, Switch } from "solid-js";
import { A } from "@solidjs/router";
import {
  TbDownload,
  TbHandMove,
  TbInfoCircle,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbPencil,
  TbUpload,
  TbZoomPan,
} from "solid-icons/tb";
import { defaultHand, Mode } from "~/logic/hand";
import { names } from "~/logic/meta/names";
import { contentsStore, loadContents } from "~/stores/contentsStore";
import { Svg } from "~/logic/meta/svgs";
import { Portal, render } from "solid-js/web";
import { useHotkey } from "~/composables/useHotkey";

export default function Sidebar() {
  const [hand, setHand] = handStore;
  const [isOpen, setIsOpen] = createSignal(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = createSignal(false);
  const [tooltipPos, setTooltipPos] = createSignal<{
    x: number;
    y: number;
  } | null>(null);
  const [contents] = contentsStore;

  const ModeButton = (props: {
    mode: Mode;
    children: JSX.Element;
  }): JSX.Element => {
    return (
      <button
        class={`p-2 cursor-pointer transition-colors ${
          hand.mode == props.mode
            ? "bg-cyan-800 hover:bg-cyan-700 active:bg-cyan-600 text-white"
            : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white"
        } flex flex-row items-center justify-center`}
        onClick={() => setHand(defaultHand(props.mode))}
      >
        {props.children}
      </button>
    );
  };

  const KindButton = (props: { kind: Kind }): JSX.Element => {
    return (
      <button
        class={`p-2 rounded-md cursor-pointer transition-colors ${
          hand.mode === "draw" && hand.kind === props.kind
            ? "bg-cyan-800 hover:bg-cyan-700 active:bg-cyan-600 text-white"
            : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white"
        } flex flex-row items-center gap-3 overflow-hidden`}
        onClick={() => setHand({ ...defaultHand("draw"), kind: props.kind })}
      >
        <div class="shrink-0">{thumbnails(props.kind)}</div>
        <span class="truncate text-left flex-1">{names[props.kind]}</span>
      </button>
    );
  };

  const getHtmlString = (component: JSX.Element): string => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
    wrapper.style.position = "absolute";
    wrapper.style.visibility = "hidden";
    wrapper.style.pointerEvents = "none";
    render(() => component, wrapper);
    const htmlString = wrapper.innerHTML;
    document.body.removeChild(wrapper);
    return htmlString;
  };

  const download = async (as: "svg" | "png") => {
    const xMin = Math.min(
      ...Object.values(contents.rects).map((rect) => rect.position.x),
    );
    const yMin = Math.min(
      ...Object.values(contents.rects).map((rect) => rect.position.y),
    );
    const xMax = Math.max(
      ...Object.values(contents.rects).map(
        (rect) => rect.position.x + rect.size.x,
      ),
    );
    const yMax = Math.max(
      ...Object.values(contents.rects).map(
        (rect) => rect.position.y + rect.size.y,
      ),
    );

    const katex = Object.values(contents.contents).some(
      (content) => content.kind === "math",
    )
      ? (await import("../katex-inlined.min.css?raw")).default
      : "";

    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE xml>
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${xMax - xMin}"
      height="${yMax - yMin}"
      viewBox="${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}">
      <metadata>${JSON.stringify(contents.contents)}</metadata>
      <defs>
        <style type="text/css">
          ${katex}
        </style>
      </defs>
    `.replace(/\n\s+/g, "\n");
    const svgFooter = `</svg>`;

    const svgContents = Object.values(contents.contents)
      .map((content) => getHtmlString(<Svg content={content} />))
      .join("\n");

    const svg = `${svgHeader}${svgContents}${svgFooter}`;

    if (as === "png") {
      const encoder = new TextEncoder();
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 10;
        canvas.width = (xMax - xMin) * scale;
        canvas.height = (yMax - yMin) * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          alert("PNG形式での保存に失敗しました。");
          return;
        }
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            alert("PNG形式での保存に失敗しました。");
            return;
          }
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = "canvas.png";
          a.click();
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      };
      img.onerror = () => {
        alert("PNG形式での保存に失敗しました。");
      };

      let latinText = "";
      for (const char of encoder.encode(svg)) {
        latinText += String.fromCharCode(char);
      }

      img.src = `data:image/svg+xml;base64,${btoa(latinText)}`;
    } else {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = svgUrl;
      a.download = "canvas.svg";
      a.click();
      URL.revokeObjectURL(svgUrl);
    }
  };

  useHotkey("s", { ctrl: true }, (e) => {
    e.preventDefault();
    download("svg");
  });

  const load = (e: Event) => {
    const file = (e.currentTarget! as HTMLInputElement).files?.item(0);
    if (!file) return;
    loadContents(file);
  };

  return (
    <>
      <aside
        class="absolute w-90 max-w-[50%] h-screen p-4 bg-white/90 border-r border-slate-200 transition-[left]"
        style={{
          left: isOpen() ? "0px" : "calc(var(--spacing) * -90)",
        }}
      >
        <div class="grid grid-cols-3 rounded-lg overflow-hidden">
          <ModeButton mode="draw">
            <TbPencil size={40} />
          </ModeButton>
          <ModeButton mode="select">
            <TbHandMove size={40} />
          </ModeButton>
          <ModeButton mode="pan">
            <TbZoomPan size={40} />
          </ModeButton>
        </div>
        <hr class="my-4 border-slate-200" />
        <div class="grid grid-cols-2 h-min gap-2 p-2">
          <For each={kinds}>{(kind) => <KindButton kind={kind} />}</For>
        </div>
      </aside>

      <div class="absolute bottom-4 left-4 flex flex-row gap-2">
        <button
          class="p-2 rounded-md bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white transition-colors flex flex-row items-center gap-2"
          onClick={() => {
            setIsOpen((s) => !s);
          }}
        >
          <Switch>
            <Match when={isOpen()}>
              <TbLayoutSidebarLeftCollapse size={20} /> しまう
            </Match>
            <Match when={!isOpen()}>
              <TbLayoutSidebarLeftExpand size={20} /> あける
            </Match>
          </Switch>
        </button>
        <button
          class="p-2 rounded-md bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white transition-colors flex flex-row items-center gap-2"
          onClick={() => setIsSaveModalOpen(true)}
        >
          <TbDownload /> ほぞん
        </button>
        <label class="p-2 rounded-md bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white transition-colors flex flex-row items-center gap-2 cursor-pointer">
          <input type="file" accept=".svg" class="hidden" onChange={load} />
          <TbUpload /> よみこみ
        </label>
        <A
          href="/about"
          class="p-2 rounded-md bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white transition-colors flex flex-row items-center gap-2"
        >
          <TbInfoCircle /> Zugaについて
        </A>
      </div>

      <Portal mount={document.body}>
        <Show when={isSaveModalOpen()}>
          <div
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-row items-center justify-center"
            onClick={() => setIsSaveModalOpen(false)}
          >
            <div
              class="bg-white rounded-md p-6 w-80 flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 class="text-xl font-bold">形式を選んでください</h2>
              <div class="flex flex-col gap-4 w-full">
                <button
                  class="w-full p-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white rounded-md flex flex-row items-center justify-center gap-2 transition-colors"
                  onClick={() => {
                    download("svg");
                    setIsSaveModalOpen(false);
                  }}
                >
                  <TbDownload /> SVG形式で保存{" "}
                  <TbInfoCircle
                    color="var(--color-slate-600)"
                    onMouseEnter={(e) => {
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setTooltipPos(null);
                    }}
                  />
                </button>
                <button
                  class="w-full p-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white rounded-md flex flex-row items-center justify-center gap-2 transition-colors"
                  onClick={() => {
                    download("png");
                    setIsSaveModalOpen(false);
                  }}
                >
                  <TbDownload /> PNG形式で保存
                </button>
              </div>
            </div>
          </div>
        </Show>
      </Portal>

      <Portal mount={document.body}>
        <div
          class="fixed pointer-events-none bg-black text-white text-sm rounded-md px-2 py-1 transition-opacity"
          style={{
            left: tooltipPos() ? `${tooltipPos()!.x + 12}px` : "-9999px",
            top: tooltipPos() ? `${tooltipPos()!.y + 12}px` : "-9999px",
            opacity: tooltipPos() ? "1" : "0",
          }}
        >
          Zugaでもう一度読み込むこともできます。
          <br />
          開くソフトウェアによっては、数式が表示されないことがあります。
        </div>
      </Portal>
    </>
  );
}
