import { OtherPropField } from "~/logic/meta/fields";
import KeyValue from "./KeyValue";
import { Index, Match, Switch } from "solid-js";
import ColorPicker from "./ColorPicker";

export default function Field(props: {
  field: OtherPropField<any>;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div>
      <KeyValue key={props.field.name}>
        <Switch>
          <Match when={props.field.type === "color"}>
            <ColorPicker
              value={props.value}
              onChange={(v) => props.onChange(v)}
            />
          </Match>
          <Match when={props.field.type === "length"}>
            <input
              type="number"
              value={props.value}
              onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
              class="w-full border border-slate-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "text"}>
            <input
              type="text"
              value={props.value}
              onInput={(e) => props.onChange(e.currentTarget.value)}
              class="w-full border border-slate-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "boolean"}>
            <div
              onClick={() => props.onChange(!props.value)}
              class="relative inline-flex items-center cursor-pointer group"
            >
              <div
                class={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  props.value ? "bg-blue-500" : "bg-slate-200"
                }`}
              >
                <div
                  class={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    props.value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </Match>
          <Match when={props.field.type === "select"}>
            <select
              value={props.value}
              onChange={(e) => props.onChange(e.currentTarget.value)}
              class="w-full border border-slate-300 rounded px-2 py-1"
            >
              <Index each={(props.field as any).options}>
                {(option) => (
                  <option value={option().value}>{option().label}</option>
                )}
              </Index>
            </select>
          </Match>
        </Switch>
      </KeyValue>
    </div>
  );
}
