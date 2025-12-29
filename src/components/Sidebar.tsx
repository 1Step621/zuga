import { readables, thumbnails } from "~/utilities/meta";
import { handStore } from "~/stores/handStore";
import { Kind, kinds } from "~/utilities/props";
import { createSignal, For, JSX, Show } from "solid-js";
import {
  TbClick,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbPencil,
} from "solid-icons/tb";
import { defaultHand, Hand } from "~/utilities/hand";

export default function Sidebar() {
  const [hand, setHand] = handStore;
  const [isOpen, setIsOpen] = createSignal(true);

  const ModeButton = (props: {
    mode: Hand["mode"];
    children: JSX.Element;
  }): JSX.Element => {
    return (
      <button
        class={`p-2 cursor-pointer transition-colors ${
          hand.mode == props.mode
            ? "bg-cyan-800 hover:bg-cyan-700 text-white"
            : "bg-gray-200 hover:bg-gray-300"
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
          hand.mode === "draw" && hand.kind == props.kind
            ? "bg-cyan-800 hover:bg-cyan-700 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        } flex flex-row items-center gap-3`}
        onClick={() => setHand({ ...defaultHand("draw"), kind: props.kind })}
      >
        {thumbnails[props.kind]}
        {readables[props.kind]}
      </button>
    );
  };

  return (
    <>
      <aside
        class="absolute w-90 max-w-[50%] h-screen p-4 bg-white/50 border-r border-gray-200 transition-[left]"
        style={{
          left: isOpen() ? "0px" : "-100%",
        }}
      >
        <div class="grid grid-cols-2 border border-gray-100 rounded-lg overflow-hidden">
          <ModeButton mode="draw">
            <TbPencil size={40} />
          </ModeButton>
          <ModeButton mode="select">
            <TbClick size={40} />
          </ModeButton>
        </div>
        <hr class="my-4 border-gray-200" />
        <div class="grid grid-cols-2 h-min gap-2 p-2">
          <For each={kinds}>{(kind) => <KindButton kind={kind} />}</For>
        </div>
      </aside>
      <button
        class="absolute bottom-4 left-4 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
        onClick={() => {
          setIsOpen((s) => !s);
        }}
      >
        {isOpen() ? (
          <TbLayoutSidebarLeftCollapse />
        ) : (
          <TbLayoutSidebarLeftExpand />
        )}
      </button>
    </>
  );
}
