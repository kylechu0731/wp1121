"use client"

import { UserContext } from "@/context/user"
import Link from "next/link";
import { redirect } from "next/navigation";
import { useContext } from "react"

export default function ProfileButton() {
  const { user } = useContext(UserContext);

  if(!user) redirect("/"); // error redirect

  return (
    <div className="flex flex-col gap-2 min-w-max">
      <div className="bg-white text-black text-center">
        ID: {user}
      </div>
      <Link
        href="/"
        className="text-center px-1 border-2 w-full border-black hover:border-white"
      >Change User</Link>
    </div>
  );
}