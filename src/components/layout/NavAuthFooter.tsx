import { auth, signIn, signOut } from "@auth";

const NavAuthFooter = async () => {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="w-full px-3 py-2.5 text-sm font-medium text-foreground-muted md:transition-colors md:duration-300 md:hover:text-foreground"
        >
          SignIn
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="w-full px-3 py-2.5 text-sm font-medium text-foreground-muted md:transition-colors md:duration-300 md:hover:text-foreground"
      >
        Logout
      </button>
    </form>
  );
};

export default NavAuthFooter;
