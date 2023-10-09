import { Box, Grid, Paper, Typography } from "@mui/material";
import type { SongProps } from "./Song";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { deleteList, deleteSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";

export type SongListProps = {
  id: string;
  name: string;
  description: string;
  songs: SongProps[];
};

type SongListPropsExtend = {
  edit: boolean;
  onClick: (e: SongListProps) => void;
  list: SongListProps;
};

export default function ListButton({edit, onClick, list}: SongListPropsExtend) {
  const { fetchLists, fetchSongs } = useSongs();

  const handleDelete = async () => {
    if(confirm("Are you sure you want to delete this list?")) {
      for(const song of list.songs) {
        try {
          await deleteSong(song.id);
          fetchSongs();
        } catch (error) {
          alert("Error: Failed to delete songs while deleting list!");
        }
      }
      try {
        await deleteList(list.id);
        fetchLists();
      } catch (error) {
        alert("Error: Failed to delete list");
      }
    }
  };
  
  return (
    <>
      <Grid item>
        { edit &&
          <RemoveCircleIcon
          sx={{
            cursor: "pointer",
            position: "absolute",
            marginLeft: "126px"
          }}
          color="error"
          onClick={handleDelete}
        /> }
        <Paper sx={{
          background: "transparent",
          //backgroundColor: "white",
          padding: "10px",
          width: "150px",
          fontSize: "15px",
          fontFamily: "Roboto",
          cursor: !edit? "pointer" : "default"
        }}
          variant="outlined"
          title={list.description}
          onClick={ () => {
            if(!edit) onClick(list) 
          }}
        >  
          <img
            src="https://lineimg.omusic.com.tw/img/album/1758075.jpg?v=20200423151455"
            style={{ width: "100%" }}
          />
          <Box sx={{
            background: "transparent",
            color: "white",
            maxWidth: "150px"
          }}>
            <Typography
              fontFamily="Roboto"
              color="secondary"
            >
            {list.songs.length} Songs
            </Typography>
            <Typography
              fontFamily="Roboto"
            >
            {list.name}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </>
  ); 
}