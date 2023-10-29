import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

// import { getAvatar } from "@/lib/utils";

export default function useUserInfo() {
  const searchParams = useSearchParams();
  const username = useMemo(() => searchParams.get("username"), [searchParams]);
  // const avatarURL = useMemo(() => getAvatar(username), [username]);

  return {
    username,
    // avatarURL,
  };
}
