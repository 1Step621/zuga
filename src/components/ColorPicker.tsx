import { For } from "solid-js";

const SWATCHES: { label: string; value: string }[] = [
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
    <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
      <For each={SWATCHES}>
        {(swatch) => {
          const isSelected = () => props.value === swatch.value;

          return (
            <button
              type="button"
              aria-label={swatch.label}
              onClick={() => props.onChange(swatch.value)}
              style={{
                width: "32px",
                height: "32px",
                border: isSelected() ? "2px solid #2563eb" : "1px solid #ccc",
                "border-radius": "6px",
                padding: "0",
                cursor: "pointer",
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
