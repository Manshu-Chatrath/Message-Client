import React, { useState, useEffect, useRef } from "react";
import { addFriend } from "reducers/userSlice";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
  ListItemAvatar,
  TextField,
  ListItem,
  Avatar,
  ListItemText,
  List,
  Button,
  ListItemIcon,
  InputAdornment,
} from "@mui/material";
import ReactVisibilitySensor from "react-visibility-sensor";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, defaultLoader } from "reducers/userSlice";
import SearchIcon from "@mui/icons-material/Search";
const SearchBar = ({ user, friendRequests, socket, sentRequests }) => {
  const dispatch = useDispatch();
  const [startIndex, setStartIndex] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const modalEl = useRef();
  const [count, setCount] = useState(10);
  const [userList, setUserList] = useState([]);
  const users = useSelector((state) => state.users.users);
  const [open, setOpen] = useState(false);
  const userListStatus = useSelector((state) => state.users.userLoading);
  const listFinished = useSelector((state) => state.users.end);
  const friendList = useSelector((state) => state.socket.friends);
  const handleClick = (friendId) => (e) => {
    e.currentTarget.disabled = true;
    if (friendRequests?.[friendId]) {
      socket.acceptRequest(friendId);
    } else {
      dispatch(addFriend({ friendId, userId: user.id }));
    }
  };
  useEffect(() => {
    if (open) {
      dispatch(
        getUsers({
          name: searchUser,
          startIndex: startIndex,
          count: count,
          userId: user.id,
        })
      );
    }
  }, [open, searchUser]);

  const toggleModal = () => {
    if (open) {
      setUserList([]);
      dispatch(defaultLoader());
      setStartIndex(0);
    }
    setOpen(!open);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalEl?.current && open) {
        if (event.target.getAttribute("data-modal") !== "userModal") {
          setUserList([]);
          setStartIndex(0);
          dispatch(defaultLoader());
          setOpen(!open);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalEl, open]);

  useEffect(() => {
    let arr = [...userList];
    arr = arr.concat(users);
    setUserList(arr);
  }, [users]);

  const findUsers = (e) => {
    setSearchUser(e.target.value);
    setUserList([]);
  };

  const loadMore = (isVisible) => {
    if (isVisible) {
      let elementIndex =
        startIndex === 0 ? startIndex + 1 + count : startIndex + count;
      let totalNumber = count;
      setCount(totalNumber);
      setStartIndex(elementIndex);
      dispatch(
        getUsers({
          name: searchUser,
          startIndex: elementIndex,
          count: totalNumber,
          userId: user.id,
        })
      );
    }
  };

  const list = () => {
    const array = [];
    if (userList.length === 0)
      return (
        <Box sx={{ textAlign: "center" }}>
          {userListStatus === "success" ? (
            "No user found!"
          ) : userListStatus === "inProgres" ? (
            <CircularProgress />
          ) : null}
        </Box>
      );

    userList?.map((user, index) => {
      if (friendList?.[user.id]) {
        return;
      } else {
        array.push(
          <ListItem
            data-modal="userModal"
            key={index}
            sx={{
              width: "96%",
              marginLeft: "2%",
              marginRight: "2%",
              marginBottom: "10px",
              background: "white",
            }}
            secondaryAction={
              <Button
                sx={{ fontWeight: "bold" }}
                data-modal="userModal"
                disabled={sentRequests?.[user.id] ? true : false}
                onClick={handleClick(user.id)}
                variant="contained">
                {friendRequests?.[user.id]
                  ? "Accept Request"
                  : sentRequests?.[user.id]
                  ? "Pending Request"
                  : "Add Friend"}
              </Button>
            }>
            <ListItemAvatar>
              <Avatar>
                <Box
                  sx={{
                    position: "relative",
                    background: user?.src
                      ? `url(${user.src})`
                      : `url(https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-user-image-179582665.jpg)`,
                    height: "50px",
                    width: "50px",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: "50%",
                  }}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                },
              }}
              primary={user.name}
            />
          </ListItem>
        );
      }
    });
    return array;
  };

  return (
    <>
      <Box>
        <Grid
          justifyContent={"space-between"}
          sx={{
            alignItems: "center",
            padding: "20px 20px",
            position: "relative",
          }}
          container>
          <div style={{ width: "100%", position: "relative" }}>
            <TextField
              onClick={toggleModal}
              onChange={findUsers}
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "100%", border: "none" }}
              placeholder="Find more people"></TextField>
            {open ? (
              <Box
                ref={modalEl}
                data-modal="userModal"
                sx={{
                  position: "absolute",
                  maxHeight: "200px",
                  overflow: "auto",
                  zIndex: 100,
                  background: "#F0F2F5",
                  borderRadius: "10px",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  width: "100%",
                  left: 0,
                }}>
                <List data-modal="userModal">
                  {list()}
                  {listFinished ? null : userList.length > 9 ? (
                    <ReactVisibilitySensor onChange={loadMore}>
                      <div>Loading...</div>
                    </ReactVisibilitySensor>
                  ) : null}
                </List>
              </Box>
            ) : null}
          </div>
        </Grid>
      </Box>
    </>
  );
};

export default SearchBar;
