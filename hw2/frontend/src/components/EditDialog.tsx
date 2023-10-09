import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CssTextField } from "./NewListDialog";
import { useRef } from "react";
import { updateSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";
import { SongListProps } from "./ListButton";

type EditDialogProps = {
  open: boolean;
  Close: () => void;
  detail: string[];
  list: SongListProps;
};

export default function EditDialog(props: EditDialogProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const singerInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const { open, Close, detail, list } = props;
  const { fetchSongs } = useSongs();
  
  const handleUpdateSong = async () => {
    if(!titleInputRef.current ||
       !singerInputRef.current ||
       !linkInputRef.current) return;
    
    if(!titleInputRef.current.value) {
      alert("Please enter a list name!");
      return;
    }
    if(!linkInputRef.current.value) {
      alert("Please enter a link!");
      return;
    }

    for(const song of list.songs) {
      if(song.title === titleInputRef.current.value &&
         song.singer === singerInputRef.current.value &&
         song.id !== detail[0]) {
        alert("The song with the same title and singe already exists.");
        return;
      }
    }

    try {
      await updateSong(detail[0], {
        title: titleInputRef.current.value,
        singer: singerInputRef.current.value,
        link: linkInputRef.current.value
      });
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to update song!");
    } finally {
      Close();
    }
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
      <DialogTitle>Edit song</DialogTitle>
      <DialogContent>
        <div>
          <CssTextField
            required
            defaultValue={detail[1]}
            inputRef={titleInputRef}
            label="Title"
            variant="standard"
            sx={{ mx: 1, mt: 1 }}
            autoFocus
            InputProps={{
              style: {
                color: "#fff",
              }
            }}
          />
        </div>
        <div>
          <CssTextField
            defaultValue={detail[2]}
            inputRef={singerInputRef}
            label="Singer"
            variant="standard"
            sx={{ mx: 1, mt: 1 }}
            autoFocus
            InputProps={{
              style: {
                color: "#fff",
              }
            }}
          />
        </div>
        <div>
          <CssTextField
            required
            defaultValue={detail[3]}
            inputRef={linkInputRef}
            label="Link"
            variant="standard"
            sx={{ mx: 1, mt: 1 }}
            autoFocus
            InputProps={{
              style: {
                color: "#fff",
              }
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdateSong}>add</Button>
        <Button onClick={Close}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}