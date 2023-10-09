import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { SongListProps } from "./ListButton";
import ClearIcon from '@mui/icons-material/Clear';
import { deleteSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";

type DeleteSongDialogProps = {
  open: boolean;
  list: SongListProps;
  deleteList: string[];
  Close: () => void;
  reset: () => void;
};

export default function DeleteSongDialog(props: DeleteSongDialogProps) {
  const { open, list, deleteList, Close, reset } = props;
  const { fetchSongs } = useSongs();
  
  const handleDeleteSongs = async () => {
    // deleteList.map( async (id) => {
    //   try {
    //     await deleteSong(id);
    //     fetchSongs();
    //   } catch (error) {
    //     alert("Error: Failed to delete song!");
    //   }
    // })

    for(const id of deleteList) {
      try {
        await deleteSong(id);
        fetchSongs();
      } catch (error) {
        alert("Error: Failed to delete song!");
      }
    }

    reset();
    Close();
  }
  
  return (
    <Dialog open={open} onClose={Close}
      sx={{
        backdropFilter: "blur(3px)"
      }}
      PaperProps={{
        style: {
          backgroundColor: "#333333",
          color: "#fff"
        }
      }}
    >
      <DialogContent>
        <div>Are you sure you want to delete the following songs?</div>
        <div>
        {list.songs.filter((e) => deleteList.includes(e.id)).map((song) => (
          <div style={{ color: "#999999" }}>
            - {song.title}
          </div>
        ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteSongs}>YES</Button>
        <Button onClick={Close}>NO</Button>
      </DialogActions>
    </Dialog>
  );
}