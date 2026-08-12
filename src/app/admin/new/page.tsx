import Link from "next/link";
import BoardEditor from "@components/board/BoardEditor";

export default function AdminNewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            New
          </h1>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm text-foreground-muted border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:text-foreground md:hover:border-foreground/30"
        >
          Back to Board
        </Link>
      </header>
      <BoardEditor submitLabel="Write" />
    </div>
  );
}
