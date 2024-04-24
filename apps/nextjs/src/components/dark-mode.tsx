"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";

import { Card, CardContent } from "@acme/ui/card";
import { Switch } from "@acme/ui/switch";
import { useTheme } from "@acme/ui/theme";

const DarkMode = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8"
      id="dark-mode"
    >
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <Moon size={64} />
        <span className="text-xl font-semibold">Dark Mode</span>
      </div>
      <Card className="flex-1">
        <CardContent className="p-6">
          {mounted && (
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(value) => {
                setTheme(value ? "dark" : "light");
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DarkMode;
