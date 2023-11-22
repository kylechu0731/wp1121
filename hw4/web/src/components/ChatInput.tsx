"use client"

import { MessageContext } from "@/context/message";
import { UserContext } from "@/context/user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ChatInput() {
  const { sendMessage } = useContext(MessageContext);
  const { user, chatter } = useContext(UserContext);
  const [content, setContent] = useState("");
  const router = useRouter();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    if (!chatter) return;
    if (!user) return;

    try {
      await sendMessage({
        senderId: user,
        receiverId: chatter,
        content
      });
      console.log("message sent");
    } catch(error) {
      alert("Failed to send message!");
      console.log(error);
    }
    
    setContent("");
  };
  return (
    <form className="sticky mt-auto bottom-0 flex bg-black pb-5 pt-1" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Send Message..."
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={content}
        disabled={!chatter}
        onChange={(e) => setContent(e.target.value)}
        className="bg-black text-md flex-1 border-2 border-gray-400 focus:border-white px-2 outline-none"
      />
      <button
        type="submit"
        className={cn("text-black font-bold py-1 px-2 text-sm", focus? "bg-white" : "bg-gray-400")}
        disabled={!content}
      >
        {">>"}
      </button>
    </form>
  );
}