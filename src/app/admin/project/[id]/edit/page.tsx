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
    <div className="flex h-dvh flex-col overflow-hidden px-4 py-8 md:px-8 md:py-10">
      <ProjectForm
        projectId={project.id}
        initialTitle={project.title}
        initialLink={project.link}
        initialImageUrl={project.imageUrl}
        initialDescription={project.description}
        pageTitle="Project Edit"
        pageDescription={project.title}
        backLink={{ href: "/project", label: "← Back to Project" }}
        submitLabel="Update"
      />
    </div>
  );
}
