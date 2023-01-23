import React from "react";
import { useAuthFormContext } from "../contexts/AuthFormContext";

const SignupForm = () => {
  const months = [
    { value: "month", label: "Month" },
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];
  const days = ["Day"].concat(
    Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  );

  const years = ["Year"].concat(
    Array.from({ length: 2023 - 1894 + 1 }, (_, i) => (2023 - i).toString())
  );
  const [, dispatch] = useAuthFormContext();

  const openLogin = () => {
    dispatch("openLogin");
  };

  return (
    <form className="mt-8">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Birthday
        </legend>
        <div className="mt-2 flex gap-6">
          <div className="">
            <select
              name="birthday"
              className="rounded border-2 border-black p-2"
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
              name="birthday"
              className="rounded border-2 border-black p-2"
            >
              {days.map((day, index) => (
                <option className="" key={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="birthday"
              className="rounded border-2 border-black p-2"
            >
              <option>Year</option>
              {years.map((year, index) => (
                <option key={index}>{year}</option>
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
          EMAIL
        </label>
        <input
          type="text"
          placeholder="user@flashit.com"
          className="rounded border-2 border-black p-3 text-lg"
        />
      </div>
      <div className="mt-6 flex flex-col">
        <label
          htmlFor=""
          className="mb-[10px] text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          USERNAME
        </label>
        <input
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
          PASSWORD
        </label>
        <input
          type="password"
          placeholder="●●●●●●●●"
          className="rounded border-2 border-black p-3 text-lg"
        />
      </div>
      <div className="mt-6 flex items-center gap-6">
        <label htmlFor="tos" className="flex items-center gap-5">
          <input type="checkbox" className="peer hidden" id="tos" />
          <div className="h-5 w-5 border-2 border-slate-400 peer-checked:border-yellow-400" />
          <p className="text-lg font-light">
            I accept Flash.it&apos;s{" "}
            <span className="font-normal text-cyan-400">Terms of Service</span>{" "}
            and{" "}
            <span className="font-normal text-cyan-400">Privacy Policy</span>
          </p>
        </label>
      </div>
      <button className="mt-6 w-full rounded bg-slate-300 px-6 py-3 text-sm font-semibold text-white">
        Sign up
      </button>
      <div className="mt-4 rounded border-2 border-slate-200 p-2">
        <p className="text-center font-medium text-slate-500">
          Already have an account?{" "}
          <span onClick={openLogin} className="text-cyan-400">
            Log in
          </span>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
