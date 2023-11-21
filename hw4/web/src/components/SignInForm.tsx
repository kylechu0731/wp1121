"use client"

import { UserContext } from "@/context/user";
import { validateUsername } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

function SignInForm() {
  const { user, setUser, setChatter, saveUser } = useContext(UserContext);
  const [displayId, setDisplayId] = useState(user);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateUsername(displayId)) {
      alert("Username too long or cannot contain space!");
      return;
    }

    try {
      await saveUser(displayId);
      console.log(displayId);
      setUser(displayId);
      setChatter("_");
      router.push("/chat");
    } catch(error) {
      alert("Failed to save user!");
      console.log(error);
    }

    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white border-2 p-6 flex flex-col gap-4 w-2/3"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="text-[16px] text-gray-200 text-clip">
          Enter your display ID to sign in. If you don't have a display ID, you
          can get one by signing up.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 items-center">
        <label
          htmlFor="displayId"
          className="text-white col-span-1 text-right text-[17px] font-semibold"
        >
          Display ID
        </label>
        <input
          className="bg-black col-span-3 px-2 transition duration-200 ease-in-out outline-none p-1 text-white text-[18px]"
          type="text"
          id="displayId"
          placeholder="Enter here..."
          value={displayId}
          required
          onChange={(e) => setDisplayId(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-end">
        <button
          type="submit"
          className="bg-black border-2 text-white py-1 px-3 text-sm text-[18px] hover:bg-white hover:text-black"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}

export default SignInForm;
