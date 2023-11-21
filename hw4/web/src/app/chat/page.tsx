import ChatList from "@/components/ChatList";
import ChatPage from "@/components/ChatPage";
import ProfileButton from "@/components/ProfileButton";

export default function Page() {
  return (
    <>
      <ProfileButton />
      <ChatList />
      <ChatPage />
    </>
  );
}