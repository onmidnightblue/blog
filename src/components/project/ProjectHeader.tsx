import { auth } from "@auth";
import PageHeader from "@components/layout/PageHeader";
import { isAdminEmail } from "@lib";
import Link from "next/link";

const ProjectHeader = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <PageHeader
      title="Project"
      description="멘탈과 손가락을 갈아 넣고 만든 눈물겨운 결과물"
      actions={
        isAdmin ? (
          <Link
            href="/admin/project/new"
            className="inline-block px-4 py-2 text-sm font-medium text-background bg-foreground rounded-md md:transition-colors md:duration-300 md:hover:bg-foreground/90"
          >
            New
          </Link>
        ) : undefined
      }
    />
  );
};

export default ProjectHeader;
