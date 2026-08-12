"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useProjectMutations } from "@hooks";

interface Props {
  projectId?: string;
  initialTitle?: string;
  initialLink?: string;
  initialImageUrl?: string;
  initialDescription?: string;
  submitLabel?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ProjectForm = ({
  projectId,
  initialTitle = "",
  initialLink = "",
  initialImageUrl = "",
  initialDescription = "",
  submitLabel = "Save",
}: Props) => {
  const router = useRouter();
  const { createProject, updateProject } = useProjectMutations();
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
      }
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
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
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:focus:border-foreground"
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
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:focus:border-foreground"
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
          className="w-full text-sm text-foreground-muted file:mr-4 file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground file:bg-background file:border file:border-foreground/15 file:rounded-md file:cursor-pointer md:file:transition-colors md:file:duration-300 md:file:hover:border-foreground/30"
        />
        <p className="text-xs text-foreground-muted">
          JPEG, PNG, WebP, GIF · Max 5MB
        </p>

        {previewUrl && (
          <div className="relative mt-2 w-full max-w-sm aspect-[4/3] border border-foreground/10 rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Project Image Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 px-2 py-1 text-xs text-foreground bg-background/90 border border-foreground/15 rounded-md backdrop-blur-sm md:transition-colors md:duration-300 md:hover:border-foreground/30"
            >
              Remove
            </button>
          </div>
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
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md resize-none md:transition-colors md:duration-300 md:focus:border-foreground"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-background bg-foreground rounded-md disabled:opacity-50 md:transition-colors md:duration-300 md:hover:bg-foreground/90"
        >
          {isUploading
            ? "Uploading image..."
            : isSubmitting
              ? "Saving..."
              : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
