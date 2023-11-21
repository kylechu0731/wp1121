"use client"

import { createContext, useState } from "react";
import { useRouter } from "next/navigation";

export type UserContext = {
  user: string;
  setUser: (e: string) => void;
  chatter: string;
  setChatter: (e: string) => void;
  saveUser: (displayId: string) => Promise<void>;
  initialiseChatter: (id: string) => void;
};

export const UserContext = createContext<UserContext>({
  user: "",
  setUser: () => {},
  chatter: "",
  setChatter: () => {},
  saveUser: async () => {},
  initialiseChatter: () => {}
});

type Props = {
  children: React.ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState("");
  const [chatter, setChatter] = useState("");
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
    console.log("8");
    setChatter((chatter) => chatter === "_" ? id : chatter);
  }

  return (
    <UserContext.Provider value={{ 
      user,
      setUser,
      chatter,
      setChatter,
      saveUser,
      initialiseChatter
     }}>
      {children}
    </UserContext.Provider>
  );
}