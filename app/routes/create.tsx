import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, MetaFunction } from "@remix-run/react";
import { PencilLine, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { db } from "~/db/db.server";

export const meta: MetaFunction = () => {
  return [{ title: "Buat Catatan" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { title, content } = Object.fromEntries(await request.formData()) as {
    title: string;
    content: string;
  };

  await db.notes.create({
    data: {
      title,
      content,
    },
  });

  return redirect("/");
};

export default function CreateNote() {
  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="sticky top-0 p-4 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2 truncate select-none">
          <PencilLine className="min-w-fit" />
          <h1 className="text-lg">Buat Catatan</h1>
        </div>
      </div>

      <Form method="POST" className="grow p-4 flex flex-col gap-4">
        <Input
          required
          minLength={1}
          maxLength={64}
          name="title"
          placeholder="Judul"
        />

        <Textarea
          required
          minLength={1}
          maxLength={300}
          name="content"
          placeholder="Isi catatan"
          spellCheck="false"
          style={{ whiteSpace: "pre-line" }}
        />

        <div className="flex gap-2 self-end">
          <Link to="/">
            <Button variant="outline" type="button">
              Batalkan
            </Button>
          </Link>
          <Button type="submit">
            <Save />
            <span>Simpan catatan</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}
