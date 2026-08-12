import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import Link from "next/link";

const BoardHeader = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <header className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            Record
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            파란만장한 삽질 일지
          </p>
        </div>

        {isAdmin && (
          <div className="shrink-0">
            <Link
              href="/admin/new"
              className="inline-block px-4 py-2 text-sm font-medium text-background bg-foreground rounded-md md:transition-colors md:duration-300 md:hover:bg-foreground/90"
            >
              New
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default BoardHeader;
