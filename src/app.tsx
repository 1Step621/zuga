import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "./app.css";
import "@fontsource-variable/inter";
import "katex/dist/katex.min.css";
import { setupKeyboardListeners } from "./stores/keyboardStore";

export default function App() {
  setupKeyboardListeners();
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
