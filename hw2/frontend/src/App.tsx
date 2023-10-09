import { useState, useEffect } from "react";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import { Button, Grid } from "@mui/material";
import Box from '@mui/material/Box';

import useSongs from "@/hooks/useSongs";
//import SongList from "./components/SongList";
import Menu from "./components/Menu";
import type { SongListProps } from "./components/ListButton";
import SongPage from "./components/SongPage";

const menu: SongListProps = {
  id: "", name: "", description: "", songs: []
};

function App() {
  const { lists, fetchLists, fetchSongs } = useSongs();
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
        <SongPage ori_list={page} reset={setPage} Back={() => setPage(() => menu)} /> }
    </>
  );
}

export default App;