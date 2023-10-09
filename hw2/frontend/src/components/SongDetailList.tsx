import { ChangeEvent, useEffect, useState } from "react";
import { SongListProps } from "./ListButton"
import { Box, Button, Checkbox, Dialog, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useSongs from "@/hooks/useSongs";
import { createSong } from "@/utils/client";

type SongDetailListProps = {
  list: SongListProps;
  checkedList: string[];
  setCheckedList: (e: string[]) => void;
  allchecked: boolean;
  setAllChecked: (e: boolean) => void;
}

const CssTableHeadCell = styled(TableCell) ({
  fontSize: "18px",
  color: "white",
  padding: "5px",
  paddingBottom: "0",
  borderBottomColor: "#222222"
});

const CssTableBodyCell = styled(TableCell) ({
  fontSize: "16px",
  color: "#999999",
  padding: "5px",
  paddingTop: "0",
  paddingBottom: "0",
  borderBottomColor: "#222222"
});

// const menu: SongListProps = {
//   id: "", name: "", description: "", songs: []
// };

export default function SongDetailList(props: SongDetailListProps) {
  const { list, checkedList, setCheckedList, allchecked, setAllChecked } = props;
  //const[allchecked, setAllChecked] = useState(false);
  const { lists, fetchLists, fetchSongs } = useSongs();
  //const [list, setList] = useState<SongListProps>(menu);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckBoxClick = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if(checked)
      setCheckedList([...checkedList, value]);
    else
      setCheckedList(checkedList.filter((item) => item !== value));
  }

  const handleSelectAll = () => {
    const collection: string[] = [];

    if(!allchecked) {
      for(const song of list.songs)
        collection.push(song.id);
    }

    setCheckedList(collection);
    setAllChecked(!allchecked);
  }

  const handleAddToOtherList = async (listId: string) => {
    if(!anchorEl) return;
    for(const song of list.songs) {
      if(song.id === anchorEl.id) {
        try {
          createSong({
            title: song.title,
            singer: song.singer,
            link: song.link,
            list_id: listId
          });
          fetchSongs();
        } catch (error) {
          alert("Error: Failed to add song to other list!");
        } finally {
          setDialogOpen(false);
        }
      }
    }
  }

  return (
    <>
      <Box mx="10px" mt="5px">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <CssTableHeadCell width="1px">
                  <Checkbox
                    sx={{ color: "#fff" }}
                    checked={allchecked}
                    onClick={() => handleSelectAll()}
                  />
                </CssTableHeadCell>
                <CssTableHeadCell>Title</CssTableHeadCell>
                <CssTableHeadCell>Singer</CssTableHeadCell>
                <CssTableHeadCell>Link</CssTableHeadCell>
                <CssTableHeadCell width="1px"></CssTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.songs.map((song) => (
                <TableRow key={song.id}>
                  <CssTableBodyCell width="1px" align="center">
                    <Checkbox
                      size="small"
                      sx={{ color: "#999999" }}
                      value={song.id}
                      checked={checkedList.includes(song.id)}
                      onChange={handleCheckBoxClick}
                    />
                  </CssTableBodyCell>
                  <CssTableBodyCell>{song.title}</CssTableBodyCell>
                  <CssTableBodyCell>{song.singer}</CssTableBodyCell>
                  <CssTableBodyCell>
                    <a href={song.link} style={{ color: "#999999" }}>{song.link}</a>
                  </CssTableBodyCell>
                  <CssTableBodyCell>
                    <IconButton size="small" 
                      id={song.id}
                      sx={{ color: "#999999" }}
                      onClick={(e) => {
                        setMenuOpen(true);
                        setAnchorEl(e.currentTarget);
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </CssTableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          setAnchorEl(null);
        }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "#333333",
            color: "#fff"
        }}}
      >
        <MenuItem>Edit</MenuItem>
        { (lists.length > 1) &&
          <MenuItem onClick={() => {
            setMenuOpen(false);
            setDialogOpen(true);
          }}>
            Add to other list
          </MenuItem> }
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#333333",
            color: "#fff"
          }
        }}
      >
        <DialogTitle>Choose the list</DialogTitle>
        <List sx={{ pt:0 }}>
          {lists.filter((e) => e.id !== list.id).map((ll) => (
            <ListItem disableGutters key={ll.id}>
              <ListItemButton onClick={() => handleAddToOtherList(ll.id)}>
                <ListItemText sx={{ textAlign: "center", color: "#999999" }}>{ll.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
}