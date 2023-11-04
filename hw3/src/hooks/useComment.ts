import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useComment() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const publishComment = async ({
    commenterName,
    eventId,
    content,
  }: {
    commenterName: string,
    eventId: number,
    content: string,
  }) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        commenterName,
        eventId,
        content,
      }),
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  return {
    publishComment,
    loading,
  }
}