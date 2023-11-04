"use client";

import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import NewEventButton from "./NewEventButton";
import Event from "./Event";
import { useState } from "react";

type EventProps = {
  id: number,
  eventName: string,
  hostName: string,
  startDate: string,
  endDate: string,
  startHour: number,
  endHour: number,
  joins: number,
  joined: boolean,
};

export default function EventRegion({
  events,
  username,
}: {
  events: EventProps[],
  username: string,
}) {
  const [searchWord, setSearchWord] = useState("");

  const isMatch = (name: string) => {
    if(!searchWord) return true;
    let modified = searchWord;
    while(modified[0] === " ")
      modified = modified.slice(1);
    while(modified[modified.length-1] === " ")
      modified = modified.slice(0, modified.length-1);
    return name.includes(modified);
  }

  return (
    <>
      <div className="w-full flex">
        <div className="m-5 flex gap-3 grow">
          <Search size={27} className="my-auto bg-gray-800 rounded-full text-white p-1"/>
          <SearchBar setSearchWord={setSearchWord}/>
        </div>
        <div className="mr-5 my-auto">
          <NewEventButton />
        </div>
      </div>
      {events.filter((event) => isMatch(event.eventName)).map((event) => (
        <Event
          key={event.id}
          username={username}
          id={event.id}
          hostName={event.hostName}
          eventName={event.eventName}
          startDate={new Date(event.startDate)}
          endDate={new Date(event.endDate)}
          startHour={event.startHour}
          endHour={event.endHour}
          joiners={event.joins ?? 0}
          joined={event.joined ?? false}
        />
      ))}
    </>
  );
}