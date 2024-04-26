import Image from "next/image";

import { signIn } from "@acme/auth";
import { Button } from "@acme/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@acme/ui/sheet";

import SignInForm from "./sign-in-form";

const SignInSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Sign In</Button>
      </SheetTrigger>
      <SheetContent side="top" className="flex h-screen">
        <div className="relative flex-1">
          <Image src="/login.svg" alt="login image" fill />
        </div>
        <div className="flex-1">
          <div className="flex flex-1 flex-col p-4">
            <span className="mb-4 inline-block text-4xl">Sign In</span>
            <div className="flex-1 ">
              <div className="flex flex-col gap-4">
                <form>
                  <Button
                    className="w-full"
                    formAction={async () => {
                      "use server";
                      await signIn("google", {
                        redirectTo: "/latest",
                      });
                    }}
                    size="lg"
                  >
                    Sign In with Google
                  </Button>
                </form>
                <form>
                  <Button
                    className="w-full"
                    formAction={async () => {
                      "use server";
                      await signIn("github", {
                        redirectTo: "/latest",
                      });
                    }}
                    size="lg"
                  >
                    Sign In with Github
                  </Button>
                </form>
              </div>
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>
              <SignInForm />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SignInSheet;
