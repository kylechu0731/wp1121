"use client";

import { useRef } from "react";
import { Input } from "./ui/input";

export default function SearchBar({
  setSearchWord,
}: {
  setSearchWord: (e: string) => void,
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input
        className="w-full"
        placeholder="Search for the event you want to join..."
        ref={searchInputRef}
        onChange={() => {
          if(!searchInputRef.current) return;
          setSearchWord(searchInputRef.current.value);
        }}
      />
    </>
  );
}