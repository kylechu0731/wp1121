"use client"

import { createContext } from "react";
import { useRouter } from "next/navigation";
import useState from "react-usestateref";

export type UserContext = {
  user: string;
  setUser: (e: string) => void;
  chatter: string;
  setChatter: (e: string) => void;
  saveUser: (displayId: string) => Promise<void>;
  initialiseChatter: (id: string) => boolean;
  is_inRoom: (viewerId: string, counterId: string) => boolean;
};

export const UserContext = createContext<UserContext>({
  user: "",
  setUser: () => {},
  chatter: "",
  setChatter: () => {},
  saveUser: async () => {},
  initialiseChatter: () => false,
  is_inRoom: () => false
});

type Props = {
  children: React.ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser, userRef] = useState("");
  const [chatter, setChatter, chatterRef] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveUser = async (displayId: string) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ displayId })
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  const initialiseChatter = (id: string) => {
    const result = chatterRef.current === "_";
    setChatter((chatter) => chatter === "_" ? id : chatter);
    return result;
  }

  const is_inRoom = (viewerId: string, counterId: string) => {
    return (userRef.current === viewerId && chatterRef.current === counterId);
  }

  return (
    <UserContext.Provider value={{ 
      user,
      setUser,
      chatter,
      setChatter,
      saveUser,
      initialiseChatter,
      is_inRoom
     }}>
      {children}
    </UserContext.Provider>
  );
}