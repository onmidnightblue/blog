import Link from "next/link";
import ProjectForm from "@components/project/ProjectForm";

export default function AdminProjectNewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            New Project
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Enter the project details to display on the card.
          </p>
        </div>
        <Link
          href="/project"
          className="px-4 py-2 text-sm text-foreground-muted border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:text-foreground md:hover:border-foreground/30"
        >
          Back to Project
        </Link>
      </header>
      <ProjectForm submitLabel="Create" />
    </div>
  );
}
