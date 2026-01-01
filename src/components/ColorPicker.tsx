import { For } from "solid-js";

const swatches: { label: string; value: string }[] = [
  { label: "Transparent", value: "transparent" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Red", value: "#ef4444" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Yellow", value: "#eab308" },
  { label: "Purple", value: "#a855f7" },
];

export default function ColorPicker(props: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div class="flex gap-2 flex-wrap">
      <For each={swatches}>
        {(swatch) => {
          const isSelected = () => props.value === swatch.value;

          return (
            <button
              type="button"
              aria-label={swatch.label}
              onClick={() => props.onChange(swatch.value)}
              class="w-8 h-8 rounded-md p-0 cursor-pointer"
              style={{
                border: isSelected() ? "2px solid var(--color-cyan-500)" : "1px solid var(--color-gray-300)",
                background:
                  swatch.value === "transparent"
                    ? "repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 8px 8px"
                    : swatch.value,
              }}
            />
          );
        }}
      </For>
    </div>
  );
}
