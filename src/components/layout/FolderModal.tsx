import { XMarkIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, type MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createFolderSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
});

export type FolderInputs = z.infer<typeof createFolderSchema>;
interface CreateFolderProps {
  closeCreateFolder: () => void;
  mutate: (data: FolderInputs) => void;
  errorMessage?: string;
  variant: "create" | "edit";
  resetForm?: MutableRefObject<(() => void) | null>;
  resetFolderMutation: () => void;
  defaultData?: FolderInputs;
}

const FolderModal = ({
  closeCreateFolder,
  mutate,
  errorMessage,
  variant,
  resetForm,
  resetFolderMutation,
  defaultData,
}: CreateFolderProps) => {
  const { register, handleSubmit, watch, reset } = useForm<FolderInputs>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: defaultData ?? undefined,
  });

  useEffect(() => {
    if (resetForm) {
      resetForm.current = reset;
    }
  }, []);

  const isDisabled =
    !(watch("title") && watch("title").length > 0) ||
    (variant === "edit" &&
      watch("title") === defaultData?.title &&
      watch("description") === defaultData.description);

  const onSubmit = (data: FolderInputs) => {
    mutate(data);
  };

  return (
    <div className="fixed top-0 left-0 z-30 grid h-screen w-screen place-items-center bg-gray-800/50">
      <div className="rounded-2xl bg-white sm:min-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="p-4 sm:p-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeCreateFolder}
                className="block"
              >
                <XMarkIcon width={24} />
              </button>
            </div>
            <h1 className="mb-8 text-3xl font-bold">Create a new folder</h1>
            {errorMessage && (
              <p className="mb-4 font-medium text-red-600">{errorMessage}</p>
            )}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="rounded-md bg-slate-100 py-2 px-4 font-medium outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-500"
                placeholder="Enter a title"
                {...register("title", {
                  onChange: () => {
                    resetFolderMutation();
                  },
                })}
              />
              <input
                type="text"
                className="rounded-md bg-slate-100 py-2 px-4 font-medium outline-none placeholder:font-medium placeholder:text-slate-500"
                placeholder="Enter a description (optional)"
                {...register("description")}
              />
            </div>
          </div>
          <div className="flex justify-end border-t p-4 sm:px-8">
            <button
              disabled={isDisabled}
              className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:bg-slate-300"
            >
              {variant === "create" ? "Create folder" : "Edit folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;
