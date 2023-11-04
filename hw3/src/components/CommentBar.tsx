"use client"

import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useComment from "@/hooks/useComment";

export default function CommentBar({
  joined,
  username,
  eventId,
}: {
  joined: boolean,
  username: string,
  eventId: number,
}) {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const { publishComment } = useComment();

  const handleComment = async () => {
    if(!username) return;
    if(!joined) return;
    if(!commentInputRef.current) return;
    if(!commentInputRef.current.value) return;

    try {
      await publishComment({
        commenterName: username,
        eventId,
        content: commentInputRef.current.value,
      });
      commentInputRef.current.value="";
    } catch(error) {
      console.log(error);
      alert("Failed to Publish Comment!");
    }
  }

  useEffect(() => {
    if(!commentInputRef.current || joined) return;
    commentInputRef.current.value = "";
  }, [joined])

  return (
    <div className="flex gap-3 ml-2 mb-4 mt-5">
      <Input
        className="w-[85%] mt-3 ml-2 transition-all"
        placeholder={joined? "leave a comment...":"join the event to share your thought!"}
        disabled={!joined}
        ref={commentInputRef}
      />
      <Button 
        className="mt-3"
        disabled={!joined}
        onClick={handleComment}
      >
        send
      </Button>
    </div>
  );
}