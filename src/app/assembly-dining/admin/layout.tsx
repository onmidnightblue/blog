import { auth, signIn } from "@auth";
import { isAdminEmail } from "@lib";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button className="text-foreground" type="submit">
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  if (!(await isAdminEmail(session.user?.email))) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-error">
        <h1 className="font-bold text-md">Access Denied.</h1>
        <p>This area is restricted to administrators only.</p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default layout;
