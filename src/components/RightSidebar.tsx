import { Index, Show } from "solid-js";
import { fieldsOfProps } from "~/logic/meta/fields";
import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import Field from "./Field";
import { Content } from "~/logic/content";
import { Kind } from "~/logic/kind";
import { Props } from "~/logic/meta/props";

export default function RightSidebar<K extends Kind>() {
  const [hand] = handStore;
  const [contents, setContents] = contentsStore;

  const target = () =>
    hand.mode == "select" && hand.selecteds.size === 1
      ? (contents.contents[hand.selecteds.values().toArray()[0]] as Content<K>)
      : null;

  const setField = (key: keyof Props<K>, value: any) => {
    if (!target()) return;
    setContents({
      contents: {
        ...contents.contents,
        [target()!.uuid]: {
          ...target(),
          props: {
            ...target()!.props,
            [key]: value,
          },
        },
      },
    });
  };

  return (
    <aside
      class="absolute w-90 max-w-[50%] h-screen p-4 bg-white/90 border-l border-gray-200 transition-[right]"
      style={{
        right: target() ? "0px" : "calc(var(--spacing) * -90)",
      }}
    >
      <Show when={target()}>
        <div class="flex flex-col gap-4">
          <Index each={fieldsOfProps[target()!.kind]}>
            {(field) => (
              <Field
                field={field()}
                value={target()!.props[field().key]}
                onChange={(v) => setField(field().key, v)}
              />
            )}
          </Index>
        </div>
      </Show>
    </aside>
  );
}
