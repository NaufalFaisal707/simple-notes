import {
  ClientActionFunctionArgs,
  Link,
  redirect,
  useFetcher,
} from "@remix-run/react";
import { ChevronLeft, Save } from "lucide-react";
import { useRef } from "react";
import Container2xl from "~/components/container-2xl";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { addNote } from "~/db";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const { title, content } = Object.fromEntries(await request.formData()) as {
    title: string;
    content: string;
  };

  const newNote = await addNote({ title, content });

  return redirect("/" + newNote);
};

export default function NewNote() {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement | null>(null);

  function autoSubmit() {
    fetcher.submit(formRef.current!, { method: "POST" });
  }

  return (
    <Container2xl className="flex h-svh flex-col">
      {/* navbar */}
      <nav className="sticky top-0 flex select-none items-center justify-between gap-4 bg-white bg-opacity-80 p-4 backdrop-blur">
        <Button variant="outline" asChild>
          <Link to="/">
            <ChevronLeft />
          </Link>
        </Button>

        <h1>Buat Catatan</h1>

        <Button variant="outline" title="Simpan catatan" onClick={autoSubmit}>
          <Save />
        </Button>
      </nav>

      {/* Note Form */}
      <fetcher.Form ref={formRef} className="flex h-full flex-col gap-4 p-4">
        <Input name="title" placeholder="Judul" className="outline-0" />
        <Textarea
          name="content"
          spellCheck="false"
          placeholder="Ketik Catatan"
          className="h-full resize-none whitespace-pre-line outline-0"
        />
      </fetcher.Form>
    </Container2xl>
  );
}
