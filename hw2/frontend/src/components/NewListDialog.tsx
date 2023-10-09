import { useRef } from "react";

import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

import useSongs from "@/hooks/useSongs";
import { createList } from "@/utils/client";

type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const CssTextField = styled(TextField) ({
  '& label.Mui-focused': {
    color: '#1DB954',
  },
  '& .MuiInputLabel-root': {
    color: '#A8A8A8',
  },
});

export default function NewListDialog({open, onClose}: NewListDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const { lists, fetchLists } = useSongs();

  const handleAddList = async () => {
    if(!nameInputRef.current) return
    if(nameInputRef.current.value === "") {
      alert("Please enter a list name!");
      return;
    }

    for(const list of lists) {
      if(nameInputRef.current.value === list.name) {
        alert("The list named \""+ nameInputRef.current.value + "\" already exists.");
        return;
      }
    }

    try {
      await createList({ name: nameInputRef.current?.value ?? "", 
        description: descriptionInputRef.current?.value ?? "" });
      fetchLists();
    } catch(error) {
      alert("Error: Failed to create list");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}
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
      <DialogTitle>New list</DialogTitle>
      <DialogContent>
        <div>
        <CssTextField
          required
          inputRef={nameInputRef}
          label="Name"
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
        <CssTextField
          inputRef={descriptionInputRef}
          label="Description"
          variant="standard"
          sx={{ mx: 1, mt: 1 }}
          InputProps={{
            style: {
              color: "#fff",
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}