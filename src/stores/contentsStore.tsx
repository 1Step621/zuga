import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Content } from "~/logic/content";
import { Kind } from "~/logic/kind";
import { Rect } from "~/utilities/rect";
import { Uuid } from "~/utilities/uuid";

const [contents, setContents] = createStore({
  contents: {} as Record<Uuid, Content<Kind>>,
  rects: {} as Record<Uuid, Rect>,
  history: [] as Record<Uuid, Content<Kind>>[],
  undoHistory: [] as Record<Uuid, Content<Kind>>[],
});

export const contentsStore = [contents, setContents] as const;

export const loadContents = (file: File) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result;
    if (typeof text !== "string") return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "image/svg+xml");
      const metadata = doc.querySelector("metadata")?.textContent;
      if (!metadata) throw new Error("No metadata found");
      const parsed = JSON.parse(metadata);
      setContents({
        contents: parsed,
        rects: {},
        history: [],
        undoHistory: [],
      });
    } catch (error) {
      alert("SVGの読み込みに失敗しました。");
      console.error(error);
    }
  };
  reader.readAsText(file);
};

export const setupFileDropListeners = () => {
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files[0];
    if (file && (file.type === "image/svg+xml" || file.name.endsWith(".svg"))) {
      loadContents(file);
    }
  };

  onMount(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    onCleanup(() => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    });
  });
};
