"use client";

import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { RouterOutputs } from "@acme/api";
import type { Session } from "@acme/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";

interface ProfileLayoutProps {
  user: RouterOutputs["user"]["byId"];
  children: ReactNode;
  session: Session | null;
}

const ProfileLayout = ({ user, children, session }: ProfileLayoutProps) => {
  const pathname = usePathname();

  const { id, name, image } = user;

  const tabsValue =
    pathname === `/users/${id}`
      ? "overview"
      : pathname === `/users/${id}/study-sets`
        ? "study-sets"
        : pathname === `/users/${id}/folders`
          ? "folders"
          : undefined;

  return (
    <>
      <div className="mb-8 flex items-start gap-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image ?? undefined} alt="user avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div>
          <span className="block text-2xl font-bold">{name}</span>
          <span className="block font-semibold text-muted-foreground">
            {name}
          </span>
        </div>
      </div>
      <Tabs value={tabsValue} className="mb-8">
        <TabsList className="w-full justify-start">
          {session?.user.id === user.id && (
            <Link href={`/users/${id}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </Link>
          )}
          <Link href={`/users/${id}/study-sets`}>
            <TabsTrigger value="study-sets">Study sets</TabsTrigger>
          </Link>
          <Link href={`/users/${id}/folders`}>
            <TabsTrigger value="folders">Folders</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </>
  );
};

export default ProfileLayout;
