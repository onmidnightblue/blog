import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@components/project/ProjectForm";
import { getProjectById } from "../../../../../lib/project";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectEditPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) notFound();

  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            Project Edit
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">{project.title}</p>
        </div>
        <Link
          href="/project"
          className="px-4 py-2 text-sm text-foreground-muted border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:text-foreground md:hover:border-foreground/30"
        >
          Back to Project
        </Link>
      </header>
      <ProjectForm
        projectId={project.id}
        initialTitle={project.title}
        initialLink={project.link}
        initialImageUrl={project.imageUrl}
        initialDescription={project.description}
        submitLabel="Update"
      />
    </div>
  );
}
