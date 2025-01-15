import {
  ClientLoaderFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import {
  ChevronLeft,
  Menu,
  PencilLine,
  SwatchBook,
  Trash2,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Container2xl from "~/components/container-2xl";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
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

export const clientAction = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
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
    throw Response.json(null, { status: 404, statusText: "ngawor" });
  }

  return targetNote;
};

export const ErrorBoundary = () => {
  return <h1>Error kang!</h1>;
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
          <DropdownMenuItem asChild>
            <Link
              to={"/" + loaderData.note_id + "/edit"}
              className="flex items-center gap-2"
            >
              <SwatchBook />
              Tema
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
        <Button variant="outline" asChild title="Semua catatan">
          <Link to="/">
            <ChevronLeft />
          </Link>
        </Button>

        <h1
          className={cn(
            loaderData.title ? "" : "text-neutral-400",
            "truncate text-lg capitalize",
          )}
          title={loaderData.title}
        >
          {loaderData.title || "- tanpa judul -"}
        </h1>

        {DropdownMenuComponents}
      </nav>

      {loaderData.content ? (
        <ScrollArea>
          <Markdown
            remarkPlugins={[remarkGfm, remarkEmoji]}
            className="prose p-4"
          >
            {loaderData.content}
          </Markdown>
        </ScrollArea>
      ) : (
        <span className="select-none p-4 capitalize text-neutral-400">
          - tanpa deskripsi -
        </span>
      )}
    </Container2xl>
  );
}
