import BoardEditor from "@components/board/BoardEditor";

export default function AdminNewPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <BoardEditor
        pageTitle="New"
        backLink={{ href: "/", label: "← Back to Record" }}
        submitLabel="Write"
      />
    </div>
  );
}
