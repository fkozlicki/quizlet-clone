import Image from "next/image";

import { signIn } from "@acme/auth";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@acme/ui/sheet";

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
                <Button size="lg">Sign In with Github</Button>
              </div>
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100"></div>
                <div>Or</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <form className="space-y-8">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="shadcn" />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SignInSheet;
