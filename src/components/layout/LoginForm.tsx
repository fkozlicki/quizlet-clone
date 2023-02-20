import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

type LoginInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string>();

  const handleLogin = async (data: LoginInputs) => {
    const res = await signIn("credentials", {
      ...data,
    });

    if (!res) return;

    if (res?.status === 200) {
      toast("Successfuly logged in");
    } else {
      toast("Couldn't log in");
      setError(res?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="flex flex-col">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Type your email address or username"
          className="peer pb-1 text-lg outline-none placeholder:text-lg placeholder:text-gray-300"
        />
        <span className="before relative h-1 w-full before:absolute before:top-0 before:left-0 before:block before:h-[2px] before:w-full before:bg-black before:transition-height before:duration-[120ms] before:ease-borderHeight before:content-[''] peer-focus:before:h-1 peer-focus:before:bg-yellow-500" />
        <label
          htmlFor="email"
          className="mt-[10px] text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Email
        </label>
      </div>
      <div className="mt-6 flex flex-col">
        <input
          {...register("password")}
          type="password"
          id="password"
          placeholder="Type your password"
          className="peer pb-1 text-lg outline-none placeholder:text-lg placeholder:text-gray-300"
        />
        <span className="before relative h-1 w-full before:absolute before:top-0 before:left-0 before:block before:h-[2px] before:w-full before:bg-black before:transition-height before:duration-[120ms] before:ease-borderHeight before:content-[''] peer-focus:before:h-1 peer-focus:before:bg-yellow-500" />
        <label
          htmlFor=""
          className="mt-[10px] text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Password
        </label>
      </div>
      <p className="mt-6 mb-6 text-center text-sm">
        By clicking Log in, you accept Flashit&apos;s Terms of Service and
        Privacy Policy
      </p>
      <button className="w-full rounded bg-cyan-400 p-6 font-bold text-white transition-height hover:bg-cyan-500">
        Log in
      </button>
      <div></div>
    </form>
  );
};

export default LoginForm;
