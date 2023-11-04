import { useRouter } from "next/navigation";
import { useState } from "react";
import useJoin from "./useJoin";

type EventProps = {
  hostname: string,
  eventname: string,
  startdate: Date,
  enddate: Date,
  starthour: number,
  endhour: number,
};

export default function useEvent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { joinEvent } = useJoin();

  const launchEvent = async ({
    eventname,
    hostname,
    startdate,
    enddate,
    starthour,
    endhour,
  }: EventProps) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        eventname,
        hostname,
        startdate,
        enddate,
        starthour,
        endhour,
      }),
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    res.json().then(function(result) {
      joinEvent({
        eventId: result.id,
        joinerName: hostname
      });
      router.push(`/event/${result.id}?username=${hostname}`);
    });

    router.refresh();
    setLoading(false);
  };

  const cancelEvent = async (eventId: number) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/events", {
      method: "DELETE",
      body: JSON.stringify({ eventId }),
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  return {
    launchEvent,
    cancelEvent,
    loading,
  }
}