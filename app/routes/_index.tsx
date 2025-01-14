import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "app.old/components/ui/button";
import { Notebook, NotebookText, Plus } from "lucide-react";
import { useState } from "react";
import Container2xl from "~/components/container-2xl";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getNotes } from "~/db";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => [
  { title: "Notes" },
  {
    name: "description",
    content: "Cobalah buat dan simpan catatan mu di sini!",
  },
];

export const clientLoader = async () => await getNotes();

export default function Notes() {
  const loaderData = useLoaderData<typeof clientLoader>();

  const [namaCatatan, setNamaCatatan] = useState("");

  function cariCatatan() {
    return loaderData.filter((f) =>
      f.title.toLowerCase().includes(namaCatatan.toLowerCase()),
    );
  }

  const AllNotes = ({ className }: { className?: string }) => {
    if (cariCatatan().length === 0 && namaCatatan) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          no catatan, no search
        </div>
      );
    }

    if (cariCatatan().length === 0) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          <NotebookText className="mx-auto size-12" />
          <p>Belum ada catatan di sini</p>
        </div>
      );
    }

    return (
      <ScrollArea>
        <div className={cn(className)}>tes</div>
      </ScrollArea>
    );
  };

  return (
    <Container2xl className="flex h-svh flex-col">
      {/* navbar */}
      <nav className="sticky top-0 flex justify-between gap-4 p-4">
        <div className="hidden items-center gap-2 sm:flex">
          <Notebook />
          <h1 className="text-lg">Notes</h1>
        </div>

        <div className="flex w-full gap-4 sm:w-fit">
          <Input
            type="search"
            placeholder="Cari Catatan"
            className="truncate duration-150 ease-in-out"
            onChange={({ target }) => setNamaCatatan(target.value)}
          />

          <Button variant="outline" asChild>
            <Link to="/create">
              <Plus />
            </Link>
          </Button>
        </div>
      </nav>

      {/* All Notes */}
      <AllNotes className="select-none" />
    </Container2xl>
  );
}
