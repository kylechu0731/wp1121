import { Box, Button, Grid, Typography } from "@mui/material";
import ListButton, { SongListProps } from "./ListButton";
import NewListDialog from "./NewListDialog";
import useSongs from "@/hooks/useSongs";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";

export default function Menu(props:{click:(e: SongListProps) => void}) {
  const { lists, fetchLists, fetchSongs } = useSongs();
  const [editEnable, setEditEnable] = useState(false);
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);

  return (
    <>
      <Box sx={{ 
        flexGrow: 1,
        marginTop: "50px",
        marginRight:"30px",
        marginBottom: "10px",
        display: "flex",
        gap: "15px"
        }}
      >
        <Typography
          color="white"
          fontFamily="Major Mono Display"
          fontSize="30px"
          ml="30px"
        >
          My PlayList
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          size="medium"
          startIcon={ editEnable? <EditIcon /> : <DeleteIcon /> }
          sx={{ 
            marginLeft: "auto",
            fontFamily: "Roboto Mono",
            maxHeight: "40px"
          }}
          onClick={ () => setEditEnable(!editEnable) }
        >
          {editEnable? "DONE": "DELETE"}
        </Button>

        <Button
          color="secondary"
          variant="outlined"
          size="medium"
          startIcon={<PlaylistAddIcon />}
          sx={{ fontFamily: "Roboto Mono", maxHeight: "40px" }}
          onClick={ () => setNewListDialogOpen(true) }
        >
          ADD
        </Button>
      </Box>
      <Grid container
      spacing={{ xs: 0.5 }}
      marginLeft={{ xs: 1 }}
      //columns={{ xs: 4, sm: 8, md: 12 }}
      >
      {lists.map((list) => (
        <ListButton 
          edit={editEnable}
          onClick={props.click}
          key={list.id}
          list={list}
        />
      ))}
      </Grid>
      <NewListDialog
        open={newListDialogOpen}
        onClose={ () => setNewListDialogOpen(false) }
      />
    </>
  );
}