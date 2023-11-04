"use client";

import useUserInfo from "@/hooks/useUserInfo";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Permanent_Marker } from 'next/font/google'
import { cn } from "@/lib/utils";
import UserName from "./UserName";

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
      <UserName
        className="mr-auto mt-10 ml-3 text-3xl"
        className2="-mt-[2px]"
        username={username}
      />
    </>
  );
}