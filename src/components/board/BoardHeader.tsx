import { auth } from "@auth";
import PageHeader from "@components/layout/PageHeader";
import { isAdminEmail } from "@lib";
import Link from "next/link";

const BoardHeader = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <PageHeader
      title="Record"
      description="파란만장한 삽질 일지"
      actions={
        isAdmin ? (
          <Link
            href="/admin/new"
            className="inline-block px-4 py-2 text-sm font-medium text-background bg-foreground rounded-md md:transition-colors md:duration-300 md:hover:bg-foreground/90"
          >
            New
          </Link>
        ) : undefined
      }
    />
  );
};

export default BoardHeader;
