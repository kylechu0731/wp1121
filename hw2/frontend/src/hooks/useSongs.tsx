import { useContext } from "react";

import { SongContext } from "./SongProvider";

// this is a custom hook, the name must start with "use"
export default function useSongs() {
  return useContext(SongContext);
}
  