import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CssTextField } from "./NewListDialog";
import { useEffect, useRef } from "react";
import { createSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";
import { SongListProps } from "./ListButton";

type NewSongDialogProps = {
  open: boolean;
  CloseDialog: () => void;
  reset: (e: SongListProps) => void;
  listId: string;
};

export default function NewSongDialog({ open, CloseDialog, reset, listId }: NewSongDialogProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const singerInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const { lists, fetchLists, fetchSongs } = useSongs();

  const handleAddSong = async () => {
    if(!titleInputRef.current ||
       !singerInputRef.current ||
       !linkInputRef.current) return;
    if(!titleInputRef.current.value) {
      alert("Please enter a title!");
      return;
    }
    if(!linkInputRef.current.value) {
      alert("Plase enter a link!");
      return;
    }
    try {
      await createSong({
        title: titleInputRef.current.value,
        singer: singerInputRef.current.value,
        link: linkInputRef.current.value,
        list_id: listId
      });
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to save song");
    } finally {
      CloseDialog();
    }
  }
  
  return (
    <Dialog open={open} onClose={CloseDialog}
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
      <DialogTitle>New Song</DialogTitle>
      <DialogContent>
        <div>
          <CssTextField
            required
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
            inputRef={singerInputRef}
            label="Singer"
            variant="standard"
            sx={{ mx: 1, mt: 1 }}
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
            inputRef={linkInputRef}
            label="Link"
            variant="standard"
            sx={{ mx: 1, mt: 1 }}
            InputProps={{
              style: {
                color: "#fff",
              }
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddSong}>add</Button>
        <Button onClick={CloseDialog}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}