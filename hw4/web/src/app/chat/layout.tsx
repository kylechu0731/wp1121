import { MessageProvider } from "@/context/message";
import { RoomProvider } from "@/context/room";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 w-screen h-max mx-3 mt-3 text-white text-[20px] h-screen">
      <RoomProvider>
        <MessageProvider>{children}</MessageProvider>
      </RoomProvider>
    </div>
  );
}