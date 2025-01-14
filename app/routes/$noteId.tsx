import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ChevronLeft,
  EllipsisVertical,
  PencilLine,
  SearchX,
  SwatchBook,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Notes } from "~/db/db.notes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { noteThemes } from "~/utils/note.themes";
import { twMerge } from "tailwind-merge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { db } from "~/db/db.server";

export const meta: MetaFunction = ({ data }) => {
  if (data) {
    const { title } = data as Notes;

    return [{ title: title.split(/\s+/).slice(0, 6).join(" ") + "..." }];
  }

  return [{ title: "Catatan tidak di temukan" }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await db.notes.findUnique({
    where: {
      note_id: params.noteId!,
    },
  });
};

export const ErrorBoundary = () => {
  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="select-none opacity-60 grow flex flex-col items-center justify-center gap-4">
        <SearchX className="size-12" />
        <h1>Catatan tidak di temukan</h1>
        <Link to="/">
          <Button variant="outline" title="Kembali">
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function PreviewNoteById() {
  const loaderData = useLoaderData<Notes>();

  const { text_color, bg_color } = noteThemes[loaderData.theme];

  return (
    <div
      className={twMerge(
        bg_color,
        text_color,
        "w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative"
      )}
    >
      <div className="sticky top-0 p-4 flex items-center gap-2 justify-between">
        <Link to="/">
          <Button variant="outline" title="Kembali">
            <ChevronLeft />
          </Button>
        </Link>

        <div className="flex gap-2">
          <Link to={"/" + loaderData.note_id + "/theme"}>
            <Button variant="outline" title="Pilih Tema Catatan">
              <SwatchBook />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" title="Menu">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid gap-1">
              <Link to={"/" + loaderData.note_id + "/edit"}>
                <Button variant="ghost" title="Edit Catatan" className="w-full">
                  <PencilLine />
                  <span>Edit</span>
                </Button>
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    title="Hapus Catatan"
                    className="w-full"
                  >
                    <Trash2 />
                    <span>Hapus</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Yakin ingin menghapus catatan ini?
                    </DialogTitle>
                    <DialogDescription>
                      Catatan akan di hapus permanen!
                    </DialogDescription>
                  </DialogHeader>

                  <Form
                    method="POST"
                    action={"/" + loaderData.note_id + "/delete"}
                  >
                    <Button variant="destructive" className="w-full">
                      <Trash2 />
                      <span>Ya, hapus</span>
                    </Button>
                  </Form>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="grow">
        <div className="p-4 flex flex-col gap-4 grow">
          <h1 className="text-lg capitalize font-semibold">
            {loaderData.title}
          </h1>

          <p
            className="whitespace-pre-wrap overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {loaderData.content}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
