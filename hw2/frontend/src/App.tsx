import { useState, useEffect } from "react";
import HeaderBar from "@/components/HeaderBar";

import useSongs from "@/hooks/useSongs";
import Menu from "./components/Menu";
import type { SongListProps } from "./components/ListButton";
import SongPage from "./components/SongPage";

const menu: SongListProps = {
  id: "", name: "", description: "", songs: []
};

function App() {
  const { fetchLists, fetchSongs } = useSongs();
  const [page, setPage] = useState<SongListProps>(menu);

  useEffect(() => {
    fetchLists();
    fetchSongs();
  }, [fetchSongs, fetchLists]);


  return (
    <>
      <HeaderBar />
      { page === menu &&
        <Menu click={setPage}/> }
      { page !== menu &&
        <SongPage ori_list={page} Back={() => setPage(() => menu)} /> }
    </>
  );
}

export default App;