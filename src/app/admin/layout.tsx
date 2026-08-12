import { auth, signIn } from "@auth";
import { isAdminEmail } from "@lib";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-paperozi text-2xl font-bold text-foreground">
            Admin
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
          Sign in with Google. Some features are only available to authorized users. 
          </p>
          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full px-4 py-3 text-sm font-medium text-background bg-foreground rounded-md md:transition-colors md:duration-300 md:hover:bg-foreground/90"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!(await isAdminEmail(session.user?.email))) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md text-center">
          <h1 className="font-paperozi text-2xl font-bold text-error">
            Access denied
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Login is complete, 
            but you are not an authorized writer, 
            so you cannot access this page.
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-dvh bg-background">{children}</div>;
}
