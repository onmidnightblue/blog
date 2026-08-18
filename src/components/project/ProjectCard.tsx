"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@types";
import { useProjectMutations } from "@hooks";

interface Props {
  project: Project;
  isAdmin?: boolean;
  className?: string;
}

const ProjectCardActions = ({ project }: { project: Project }) => {
  const router = useRouter();
  const { deleteProject } = useProjectMutations();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteProject.mutateAsync(project.id);
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete. Please try again later.");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link
        href={`/admin/project/${project.id}/edit`}
        className="px-3 py-1.5 text-xs font-medium text-foreground border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:border-foreground/30"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteProject.isPending}
        className="px-3 py-1.5 text-xs font-medium text-error border border-error/20 rounded-md disabled:opacity-50 md:transition-colors md:duration-300 md:hover:border-error/40"
      >
        {deleteProject.isPending ? "..." : "Delete"}
      </button>
    </div>
  );
};

const ProjectCard = ({ project, isAdmin = false, className = "" }: Props) => {
  return (
    <article
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-md border border-foreground/10 bg-background md:transition-[border-color,box-shadow] md:duration-300 ${className}`}
    >
      <div className="relative h-32 shrink-0 overflow-hidden bg-foreground/5 sm:h-36 md:h-40 lg:h-44">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-foreground-muted">
            No Image
          </div>
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-3 sm:p-4">
        <h2 className="font-paperozi shrink-0 overflow-hidden text-base font-bold leading-5 text-foreground line-clamp-2 sm:text-lg">
          {project.title}
        </h2>

        <div className="mt-2 h-4 shrink-0 overflow-hidden">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-4 truncate font-sans text-xs leading-4 text-link underline underline-offset-2 md:transition-colors md:duration-300 md:hover:text-link-hover"
            >
              {project.link}
            </a>
          ) : (
            <span className="block h-4" aria-hidden="true" />
          )}
        </div>

        {project.description && (
          <p className="project-card-description mt-10 shrink-0 text-sm leading-relaxed text-foreground-muted">
            {project.description}
          </p>
        )}

        {isAdmin && (
          <div className="mt-auto shrink-0 pt-3 sm:pt-4">
            <ProjectCardActions project={project} />
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
