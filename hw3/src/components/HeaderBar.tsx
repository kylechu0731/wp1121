"use client";

import useUserInfo from "@/hooks/useUserInfo";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Permanent_Marker } from 'next/font/google'
import { cn } from "@/lib/utils";

const font_pm = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

export default function HeaderBar() {
  const { username } = useUserInfo();
  const router = useRouter();

  return (
    <>
      <div className="flex w-full py-3 px-4">
        <div className={cn(font_pm.className, "text-5xl")}>
          JoinMe
        </div>
        <Button
          className="ml-auto"
          variant="outline"
          onClick={() => router.push("/")}
        >Change User</Button>
      </div>
      <div className="ml-3 mt-10">
        Welcome! @{username}
      </div>
    </>
  );
}