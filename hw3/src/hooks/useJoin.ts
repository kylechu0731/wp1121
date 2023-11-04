import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useJoin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joinEvent = async ({
    eventId,
    joinerName,
  }: {
    eventId: number,
    joinerName: string,
  }) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/joins", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        joinerName,
      }),
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  const unjoinEvent = async ({
    eventId,
    joinerName,
  }: {
    eventId: number;
    joinerName: string;
  }) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/joins", {
      method: "DELETE",
      body: JSON.stringify({
        eventId,
        joinerName,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    joinEvent,
    unjoinEvent,
    loading,
  }
}