import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import type { LinksFunction } from "@remix-run/node";
import tailwind from "./tailwind.css?url";
import { NotepadTextDashed, HeartCrack } from "lucide-react";
import Container2xl from "./components/container-2xl";
import { sendSkipWaitingMessage, useSWEffect } from "@remix-pwa/sw";
import { usePWAManager } from "@remix-pwa/client";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: tailwind,
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <NotepadTextDashed className="mx-auto size-12" />
          <p>{error.statusText}</p>
        </div>
      </Container2xl>
    );
  } else if (error instanceof Error) {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <HeartCrack className="mx-auto size-12" />
          <p>{error.message}</p>
        </div>
      </Container2xl>
    );
  } else {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <HeartCrack className="mx-auto size-12" />
          <p>Aplikasi Catatan Rusak</p>
        </div>
      </Container2xl>
    );
  }
};

export default function App() {
  useSWEffect();

  const location = useLocation();

  const { swUpdate } = usePWAManager();

  useEffect(() => {
    if (!swUpdate) return;

    if (swUpdate.isUpdateAvailable) {
      toast("Update Tersedia", {
        id: "note-update",
        duration: Infinity,
        action: {
          label: <span>Update Aplikasi</span>,
          onClick: () => {
            sendSkipWaitingMessage(swUpdate.newWorker!);
            window.location.reload();
          },
        },
      });
    }
  }, [swUpdate, swUpdate.isUpdateAvailable, swUpdate.newWorker]);

  return (
    <div className="overflow-hidden">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{
          type: "spring",
          visualDuration: 0.3,
          bounce: 0.4,
        }}
      >
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
