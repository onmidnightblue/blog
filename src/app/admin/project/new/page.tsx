import ProjectForm from "@components/project/ProjectForm";

export default function AdminProjectNewPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden px-4 py-8 md:px-8 md:py-10">
      <ProjectForm
        pageTitle="New Project"
        pageDescription="Enter the project details to display on the card."
        backLink={{ href: "/project", label: "← Back to Project" }}
        submitLabel="Write"
      />
    </div>
  );
}
