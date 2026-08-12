import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import Link from "next/link";

const ProjectHeader = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <header className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            Project
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            멘탈과 손가락을 갈아 넣고 만든 눈물겨운 결과물
          </p>
        </div>

        {isAdmin && (
          <div className="shrink-0">
            <Link
              href="/admin/project/new"
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

export default ProjectHeader;
