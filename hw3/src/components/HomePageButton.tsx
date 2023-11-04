"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePageButton({
  username,
}: {
  username: string,
}) {
  const router = useRouter();

  return (
    <button 
      className="flex m-3 w-fit p-1 pr-3 bg-gray-100 font-mono rounded-full transition hover:bg-black hover:text-white"
      onClick={() => router.push(`/?username=${username}`)}
    >
      <ChevronLeft size={25}/>
        Home page
    </button>
  );
}