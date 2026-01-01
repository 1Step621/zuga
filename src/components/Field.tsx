import { OtherPropField } from "~/logic/meta/fields";
import KeyValue from "./KeyValue";
import { Match, Switch } from "solid-js";
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
              class="w-full border border-gray-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "text"}>
            <input
              type="text"
              value={props.value}
              onInput={(e) => props.onChange(e.currentTarget.value)}
              class="w-full border border-gray-300 rounded px-2 py-1"
            />
          </Match>
        </Switch>
      </KeyValue>
    </div>
  );
}
