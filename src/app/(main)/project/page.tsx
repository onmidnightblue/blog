import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import { PAGE_PADDING_X } from "@components/layout/PageShell";
import ProjectFeed from "@components/project/ProjectFeed";
import ProjectHeader from "@components/project/ProjectHeader";

const page = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className={`shrink-0 ${PAGE_PADDING_X} pt-4 sm:pt-6 md:pt-8`}>
        <ProjectHeader />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden pb-4 sm:pb-6 md:pb-8">
        <ProjectFeed isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default page;
