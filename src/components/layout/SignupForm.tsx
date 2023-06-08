import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";
import { toast } from "react-hot-toast";

const credentialsSchema = z.object({
  birthday: z.object({
    month: z.number().positive(),
    day: z.number().positive(),
    year: z.number().positive(),
  }),
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  name: z.string().min(1, "Enter your name"),
  password: z.string().min(1, "Enter your password"),
  accepted: z.literal(true),
});

type CredentialsInputs = z.infer<typeof credentialsSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<CredentialsInputs>({
    mode: "onChange",
    resolver: zodResolver(credentialsSchema),
  });
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      reset();
      toast("Created successfuly", {
        icon: "✅",
      });
    },
    onError: () => {
      toast("Couldn't create user", {
        icon: "❌",
      });
    },
  });
  const months = [
    { value: 0, label: "Month" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const days = [{ value: 0, label: "Day" }].concat(
    Array.from({ length: 31 }, (_, i) => ({
      value: i + 1,
      label: (i + 1).toString(),
    }))
  );
  const years = [{ value: 0, label: "Year" }].concat(
    Array.from({ length: 130 }, (_, i) => ({
      value: new Date().getFullYear() - i,
      label: (new Date().getFullYear() - i).toString(),
    }))
  );

  const notFilledAllFields = () => {
    const { birthday, email, name, password, accepted } = watch();
    if (Object.values(watch()).length === 0) return true;
    return (
      Object.values(birthday).some((value) => value === 0) ||
      [email, name, password].some((value) => value.length === 0) ||
      !accepted
    );
  };

  const createAccount = (data: CredentialsInputs) => {
    const {
      birthday: { month, day, year },
      email,
      password,
      name,
    } = data;
    const birthday = new Date(`${month}/${day}/${year}`);
    createUser.mutate({
      birthday,
      email,
      password,
      name,
    });
  };

  return (
    <form onSubmit={handleSubmit(createAccount)} className="mt-8">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {errors.birthday ? (
            <span className="text-red-500">Enter your birthday</span>
          ) : (
            <span>Birthday</span>
          )}
        </legend>
        <div className="mt-2 flex gap-6">
          <div className="">
            <select
              {...register("birthday.month", {
                valueAsNumber: true,
              })}
              className={`rounded border-2 p-2 outline-none ${
                errors.birthday?.month ? "border-red-500" : "border-black"
              }`}
            >
              {months.map(({ label, value }, index) => (
                <option key={index} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              {...register("birthday.day", { valueAsNumber: true })}
              className={`rounded border-2 border-black p-2 outline-none ${
                errors.birthday?.day ? "border-red-500" : ""
              }`}
            >
              {days.map(({ value, label }, index) => (
                <option className="" key={index} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              {...register("birthday.year", { valueAsNumber: true })}
              className={`rounded border-2 border-black p-2 outline-none ${
                errors.birthday?.year ? "border-red-500" : ""
              }`}
            >
              {years.map(({ value, label }, index) => (
                <option key={index} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>
      <div className="mt-6 flex flex-col">
        <label
          htmlFor=""
          className="mb-[10px] text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {errors.email ? (
            <span className="text-red-600">{errors.email.message}</span>
          ) : (
            <span>EMAIL</span>
          )}
        </label>
        <input
          {...register("email")}
          type="text"
          placeholder="user@flashit.com"
          className="rounded border-2 border-black p-3 text-lg"
        />
        {}
      </div>
      <div className="mt-6 flex flex-col">
        <label
          htmlFor=""
          className="mb-[10px] text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {errors.name ? (
            <span className="text-red-600">{errors.name.message}</span>
          ) : (
            <span>NAME</span>
          )}
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder="andrew123"
          className="rounded border-2 border-black p-3 text-lg"
        />
      </div>
      <div className="mt-6 flex flex-col">
        <label
          htmlFor=""
          className="mb-[10px] text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {errors.password ? (
            <span className="text-red-600">{errors.password.message}</span>
          ) : (
            <span>PASSWORD</span>
          )}
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="●●●●●●●●"
          className="rounded border-2 border-black p-3 text-lg"
        />
      </div>
      <div className="mt-6 flex flex-col items-start gap-6">
        <label htmlFor="tos" className="flex items-center gap-5">
          <input
            {...register("accepted")}
            type="checkbox"
            className="peer hidden"
            id="tos"
          />
          <div className="relative h-5 w-5 border-2 border-slate-400 before:absolute before:top-1/2 before:left-1/2 before:hidden before:-translate-x-1/2 before:-translate-y-1/2 before:content-['✓'] peer-checked:border-yellow-400 peer-checked:before:block" />
          <p className="text-lg font-light">
            I accept Flash.it&apos;s{" "}
            <span className="font-normal text-cyan-400">Terms of Service</span>{" "}
            and{" "}
            <span className="font-normal text-cyan-400">Privacy Policy</span>
          </p>
        </label>
        {errors.accepted && (
          <div className="w-full border-2 border-red-500 p-3 text-xs font-semibold text-red-500">
            PLEASE ACCEPT QUIZLET&apos;S TERMS OF SERVICE AND PRIVACY POLICY TO
            CONTINUE.
          </div>
        )}
      </div>
      <button
        disabled={notFilledAllFields() || !isValid}
        type="submit"
        className="mt-6 w-full rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Sign up
      </button>
      <div className="mt-4 rounded border-2 border-slate-200 p-2">
        <p className="text-center font-medium text-slate-500">
          Already have an account? <span className="text-cyan-400">Log in</span>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
