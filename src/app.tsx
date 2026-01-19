import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { setupKeyboardListeners } from "./stores/keyboardStore";
import { setupFileDropListeners } from "./stores/contentsStore";

import "./app.css";
import "@fontsource-variable/inter";
import "katex/dist/katex.min.css";

export default function App() {
  setupKeyboardListeners();
  setupFileDropListeners();
  return (
    <>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>Zuga</Title>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </>
  );
}
