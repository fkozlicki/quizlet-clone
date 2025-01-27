import { signIn } from "@acme/auth";
import { Button } from "@acme/ui/button";

import GithubIcon from "../icons/github";
import GoogleIcon from "../icons/google";

export default function SignInWithOauth() {
  return (
    <form className="flex flex-col gap-2">
      <Button
        formAction={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Sign In with Google
      </Button>

      <Button
        formAction={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        Sign In with Github
      </Button>
    </form>
  );
}
