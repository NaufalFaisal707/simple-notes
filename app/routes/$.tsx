import { Link, MetaFunction } from "@remix-run/react";
import { FileX } from "lucide-react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Halaman tidak di temukan" }];
};

export default function PageNotFound() {
  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="select-none opacity-60 grow flex flex-col items-center justify-center gap-4">
        <FileX className="size-12" />
        <h1>Halaman tidak di temukan</h1>
        <Link to="/">
          <Button variant="outline" title="Kembali">
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
}
