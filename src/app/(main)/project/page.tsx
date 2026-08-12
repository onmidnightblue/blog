import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import ProjectFeed from "@components/project/ProjectFeed";
import ProjectHeader from "@components/project/ProjectHeader";

const page = async () => {
  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden py-4 sm:py-6 md:py-8 h-full">
      <div className="shrink-0 px-4 md:px-12">
        <ProjectHeader />
      </div>
      <div className="flex min-h-0 w-full flex-1 overflow-hidden py-6">
        <ProjectFeed isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default page;
