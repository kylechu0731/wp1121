import { Box, Button, ClickAwayListener, Input } from "@mui/material";
import { SongListProps } from "./ListButton";
import ReplyIcon from '@mui/icons-material/Reply';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from "react";
import { updateList } from "@/utils/client";
import useSongs from "@/hooks/useSongs";
import NewSongDialog from "./NewSongDialog";
import SongDetailList from "./SongDetailList";
import DeleteSongDialog from "./DeleteSongDialog";

type SongPageProps = {
  ori_list: SongListProps;
  Back: () => void;
}

export default function SongPage({ori_list, Back}: SongPageProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const { lists, fetchLists } = useSongs();
  const [newSongDialogOpen, setNewSongDialogOpen] = useState(false);
  const [delSongDialogOpen, setDelSongDialogOpen] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [allchecked, setAllChecked] = useState(false);

  const [list, setList] = useState<SongListProps>(ori_list);

  useEffect(() => {
    for(const l of lists) {
      if(l.id === list.id) {
        setList(l);
        break;
      }
    }
  }, [lists, list.id]);

  const handleUpdateName = async () => {
    if (!nameInputRef.current) return;

    for(const ll of lists) {
      if(ll.name === nameInputRef.current.value && ll.id !== list.id) {
        alert("The list named \""+ nameInputRef.current.value + "\" already exists.");
        nameInputRef.current.value = list.name;
        return;
      }
    }

    const newName = nameInputRef.current.value;
    if (newName !== list.name) {
      try {
        await updateList(list.id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
  };

  const handleUpdateDescription = async () => {
    if (!descriptionInputRef.current) return;

    const newDescription = descriptionInputRef.current.value;
    if (newDescription !== list.description) {
      try {
        await updateList(list.id, { description: newDescription });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list description");
      }
    }
  };

  const handleBack = async () => {
    if(!nameInputRef.current || !descriptionInputRef.current) return;
    if(!nameInputRef.current.value)
      alert("Please enter a list name!");
    else {
      if(nameInputRef.current.value !== list.name) handleUpdateName();
      if(descriptionInputRef.current.value !== list.description) handleUpdateDescription();
      Back();
    }
  };

  const handleAdd = async () => {
    if(!nameInputRef.current || !descriptionInputRef.current) return;
    if(!nameInputRef.current.value)
      alert("Please enter a list name!");
    else
      setNewSongDialogOpen(true);
  };

  const handleDeleteSongs = async () => {
    
    if(!checkedList.length)
      alert("Choose the songs you want to delete!")
    else if(!nameInputRef.current || !nameInputRef.current.value) {
      alert("Please enter a list name at first!")
    }
    else {
      setDelSongDialogOpen(true);
    }
  }
  
  return (
    <>
      <Box
        display="flex"
        mt="30px"
        mx="30px"
        component="span"
      >
        <Box>
          <img
            src="https://lineimg.omusic.com.tw/img/album/1758075.jpg?v=20200423151455"
            style={{
              width: "180px",
              borderRadius: "20px"
            }}
          />
        </Box>
        <Box>
          <Box mx="30px" maxHeight="50px">
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                disableUnderline
                defaultValue={list.name}
                className="grow"
                placeholder="New List"
                sx={{ 
                  fontSize: "30px",
                  color: "white"
                }}
                inputRef={nameInputRef}
              />
            </ClickAwayListener>
          </Box>
          <Box mx="30px" maxHeight="80px">
            <ClickAwayListener onClickAway={handleUpdateDescription}>
              <Input
                multiline
                maxRows={6}
                fullWidth
                disableUnderline
                defaultValue={list.description}
                className="grow"
                placeholder="Some description..."
                sx={{ 
                  fontSize: "15px",
                  color: "#999999"
                }}
                inputRef={descriptionInputRef}
              />
            </ClickAwayListener>
          </Box>
        </Box>
      </Box>
      <Box 
        display="flex"
        gap="15px"
        marginRight="30px"
      >
        <Button
          color="secondary"
          variant="contained"
          size="medium"
          startIcon={<ReplyIcon />}
          sx={{ 
            marginLeft: "auto",
            fontFamily: "Roboto Mono"
          }}
          onClick={handleBack}
        >
          BACK
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="medium"
          sx={{ fontFamily: "Roboto Mono" }}
          startIcon={checkedList.length? <DeleteIcon/> : <DeleteOutlineIcon />}
          onClick={handleDeleteSongs}
        >
          DELETE
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="medium"
          sx={{ fontFamily: "Roboto Mono" }}
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          ADD
        </Button>
        <NewSongDialog
          open={newSongDialogOpen}
          CloseDialog={() => setNewSongDialogOpen(false)}
          list={list}
        />
      </Box>
      <SongDetailList 
        list={list}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
        allchecked={allchecked}
        setAllChecked={setAllChecked}
      />
      <DeleteSongDialog
        open={delSongDialogOpen}
        list={list}
        deleteList={checkedList}
        Close={() => setDelSongDialogOpen(false)}
        reset={() => {
          setCheckedList([]);
          setAllChecked(false);
        }}
      />
    </>
  );
}

