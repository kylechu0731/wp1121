import Event from "@/components/Event";
import HeaderBar from "@/components/HeaderBar";
import NameDialog from "@/components/NameDialog";
import NewEventButton from "@/components/NewEventButton";
import SearchBar from "@/components/SearchBar";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { Search } from "lucide-react";

const event1 = {
  id: 1,
  hostName: "Alex",
  eventName: "Allons faire des devoirs !",
  startDate: new Date(2023, 10, 27),
  endDate: new Date(2023, 10, 31),
  startHour: 13,
  endHour: 18,
  joiners: 10,
  joined: true,
  createdAt: new Date(2023, 10, 13, 10, 18),
};

const event2 = {
  id: 2,
  hostName: "Jerry",
  eventName: "Qui pourra dormir avec moi le soir prochain ?",
  startDate: new Date(2023, 10, 28),
  endDate: new Date(2023, 10, 28),
  startHour: 18,
  endHour: 23,
  joiners: 2,
  joined: false,
  createdAt: new Date(2023, 10, 27, 23, 59),
};

const tempEvents = [event1, event2];

type HomeProps = {
  searchParams: {
    username?: string;
  };
};

export default async function Home({
  searchParams: { username },
}: HomeProps) {

  if(username) {
    await db
      .insert(usersTable)
      .values({ userName: username })
      .execute();
  }

  return (
    <>
      <main className="mx-auto flex-col">
        <HeaderBar />
        <div className="w-full flex">
          <div className="m-5 flex gap-3 grow">
            <Search size={27} className="my-auto bg-gray-800 rounded-full text-white p-1"/>
            <SearchBar />
          </div>
          <div className="mr-5 my-auto">
            <NewEventButton />
          </div>
        </div>
        {tempEvents.map((event) => (
          <Event
            key={event.id}
            username={username}
            id={event.id}
            hostName={event.hostName}
            eventName={event.eventName}
            startDate={event.startDate}
            endDate={event.endDate}
            startHour={event.startHour}
            endHour={event.endHour}
            joiners={event.joiners}
            joined={event.joined}
            createdAt={event.createdAt}
          />
          ))}
        <NameDialog />
      </main>
    </>
  )
}
