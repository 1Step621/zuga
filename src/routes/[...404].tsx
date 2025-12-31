import { Title } from "@solidjs/meta";

export default function NotFound() {
  return (
    <>
      <Title>Not Found - Zuga</Title>
      <main class="flex min-h-screen flex-col items-center justify-center">
        <h1 class="text-9xl font-bold">404</h1>
        <p class="text-muted-foreground text-2xl">Page not found</p>
        <hr class="my-8 w-1/3 border-gray-300" />
        <span class="mb-4 text-gray-500">Zuga</span>
      </main>
    </>
  );
}
