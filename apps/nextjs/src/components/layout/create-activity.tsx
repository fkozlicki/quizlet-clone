"use client";

import { useEffect } from "react";

import { api } from "~/trpc/react";

const CreateActivity = () => {
  const { mutate } = api.activity.create.useMutation();

  useEffect(() => {
    mutate();
  }, []);

  return null;
};

export default CreateActivity;
