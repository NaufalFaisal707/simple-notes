import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import { ChevronLeft, Menu, PencilLine, Trash2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Container2xl from "~/components/container-2xl";
import { Button } from "~/components/ui/button";
import { deleteNoteById, getNoteById } from "~/db";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { MetaArgs } from "@remix-run/node";

export const meta = ({ data }: MetaArgs & { data: { title: string } }) => {
  if (!data) {
    return [{ title: "Catatan Tidak Ditemukan" }];
  }

  return [{ title: data.title }];
};

export const clientAction = async ({
  request,
  params,
}: ClientActionFunctionArgs) => {
  const { noteId } = params as { noteId: string };

  if (request.method !== "DELETE") {
    throw Response.json(null, {
      status: 405,
      statusText: "gk boleh gitu kakak",
    });
  }

  await deleteNoteById(noteId);

  return redirect("/");
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { noteId } = params as { noteId: string };

  const targetNote = await getNoteById(noteId);

  if (!targetNote) {
    throw Response.json(null, {
      status: 404,
      statusText: "Catatan Tidak Di Temukan",
    });
  }

  return targetNote;
};

export default function TargetNote() {
  const loaderData = useLoaderData<typeof clientLoader>();

  const DropdownMenuComponents = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Menu Catatan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="*:cursor-pointer">
          <DropdownMenuItem asChild>
            <Link
              to={"/" + loaderData.note_id + "/edit"}
              className="flex items-center gap-2"
            >
              <PencilLine />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

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
              <DialogTitle>Yakin ingin menghapus catatan ini?</DialogTitle>
              <DialogDescription>
                Catatan akan di hapus permanen!
              </DialogDescription>
            </DialogHeader>

            <Form method="DELETE" action={"/" + loaderData.note_id}>
              <Button variant="destructive" className="w-full">
                <Trash2 />
                <span>Ya, hapus</span>
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Container2xl className="flex h-svh flex-col overflow-hidden">
      {/* navbar */}
      <nav className="sticky top-0 flex select-none items-center justify-between gap-4 bg-white p-4">
        <Button variant="outline" asChild title="Semua Catatan">
          <Link to="/">
            <ChevronLeft />
          </Link>
        </Button>

        <h1
          className={cn(
            loaderData.title ? "" : "text-neutral-400",
            "truncate text-lg",
          )}
          title={loaderData.title}
        >
          {loaderData.title || "- Tanpa Judul -"}
        </h1>

        {DropdownMenuComponents}
      </nav>

      {loaderData.content ? (
        <div className="overflow-auto">
          <Markdown
            remarkPlugins={[remarkGfm, remarkEmoji]}
            className="prose p-4"
          >
            {loaderData.content}
          </Markdown>
        </div>
      ) : (
        <span className="select-none p-4 text-neutral-400">
          - Tanpa Deskripsi -
        </span>
      )}
    </Container2xl>
  );
}
