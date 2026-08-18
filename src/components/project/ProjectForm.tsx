"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import AdminEditorHeader from "@components/admin/AdminEditorHeader";
import { useProjectMutations } from "@hooks";
import ProjectCard from "./ProjectCard";

interface Props {
  projectId?: string;
  initialTitle?: string;
  initialLink?: string;
  initialImageUrl?: string;
  initialDescription?: string;
  submitLabel?: string;
  formId?: string;
  backLink?: {
    href: string;
    label: string;
  };
  pageTitle?: string;
  pageDescription?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MIN_PANEL_WIDTH = 28;

const ProjectForm = ({
  projectId,
  initialTitle = "",
  initialLink = "",
  initialImageUrl = "",
  initialDescription = "",
  submitLabel = "Save",
  formId = "project-form",
  backLink,
  pageTitle,
  pageDescription,
}: Props) => {
  const router = useRouter();
  const { createProject, updateProject } = useProjectMutations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [link, setLink] = useState(initialLink);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [description, setDescription] = useState(initialDescription);
  const [isUploading, setIsUploading] = useState(false);
  const isSubmitting =
    createProject.isPending || updateProject.isPending || isUploading;

  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const nextWidth = ((event.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(72, Math.max(MIN_PANEL_WIDTH, nextWidth)));
    };

    const handleMouseUp = () => setIsResizing(false);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      window.alert("You can only upload JPEG, PNG, WebP, or GIF files.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      window.alert("Please select an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
    setPreviewUrl("");
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post<{ success: boolean; url: string }>(
      "/api/project/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data.url;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let nextImageUrl = imageUrl.trim();

    try {
      if (imageFile) {
        setIsUploading(true);
        nextImageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        link: link.trim(),
        imageUrl: nextImageUrl,
        description: description.trim(),
      };

      if (projectId) {
        await updateProject.mutateAsync({ id: projectId, payload });
      } else {
        await createProject.mutateAsync(payload);
      }

      router.push("/project");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to save. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitButtonLabel = isUploading
    ? "Uploading image..."
    : isSubmitting
      ? "Saving..."
      : submitLabel;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {backLink ? (
        <AdminEditorHeader
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          backLink={backLink}
          formId={formId}
          submitButtonLabel={submitButtonLabel}
          isSubmitting={isSubmitting}
          marginBottom="mb-6"
        />
      ) : null}

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col"
      >
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 overflow-hidden rounded-md border border-foreground/10"
      >
        <div
          className="flex min-h-0 min-w-0 flex-col overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="shrink-0 border-b border-foreground/10 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Edit
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto flex max-w-xl flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Project Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Project Title"
                  className="w-full rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="link" className="text-sm font-medium text-foreground">
                  Link
                </label>
                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="image" className="text-sm font-medium text-foreground">
                  Image
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="w-full text-sm text-foreground-muted file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-foreground/15 file:bg-background file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground md:file:transition-colors md:file:duration-300 md:file:hover:border-foreground/30"
                />
                <p className="text-xs text-foreground-muted">
                  JPEG, PNG, WebP, GIF · Max 5MB
                </p>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="self-start rounded-md border border-foreground/15 px-3 py-1.5 text-xs text-foreground-muted md:transition-colors md:duration-300 md:hover:border-foreground/30 md:hover:text-foreground"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short description (about 50 characters)"
                  rows={4}
                  className="w-full resize-none rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize editor panels"
          onMouseDown={() => setIsResizing(true)}
          className={`relative w-1 shrink-0 cursor-col-resize bg-foreground/10 md:transition-colors md:duration-300 md:hover:bg-foreground/20 ${
            isResizing ? "bg-foreground/25" : ""
          }`}
        />

        <div
          className="min-h-0 min-w-0 flex-1 overflow-hidden bg-foreground/[0.02]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-foreground/10 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Preview
              </p>
            </div>

            <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-6">
              <div className="project-feed-slide h-[28rem] max-w-full shrink-0">
                <ProjectCard
                  project={{
                    id: projectId ?? "preview",
                    title: title.trim() || "Project Title",
                    link: link.trim(),
                    imageUrl: previewUrl,
                    description: description.trim(),
                    createdAt: new Date().toISOString(),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!backLink ? (
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50 md:transition-colors md:duration-300 md:hover:bg-foreground/90"
          >
            {submitButtonLabel}
          </button>
        </div>
      ) : null}
    </form>
    </div>
  );
};

export default ProjectForm;
