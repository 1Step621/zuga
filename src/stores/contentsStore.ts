import { createStore } from "solid-js/store";
import { Content } from "~/logic/content";
import { Kind } from "~/logic/kind";

export const contentsStore = createStore({
  contents: {} as Record<`${string}-${string}-${string}-${string}-${string}`, Content<Kind>>,
});
