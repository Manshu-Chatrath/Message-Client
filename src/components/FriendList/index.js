import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { defaultMessages } from "reducers/socketSlice";
import { useDispatch } from "react-redux";

const FriendList = ({
  selectedFriend,
  socket,
  user,
  setChatWindow,
  mediumScreen,
  notifications,
  friendRequests,
}) => {
  const friends = useSelector((state) => state.socket.friends);
  const dispatch = useDispatch();

  const selectFriend = (friend) => {
    selectedFriend(friend);
    socket.getFriends({ senderId: user.id, recipientId: friend.userId });
  };

  const friendList = () => {
    const arr = [];
    for (let key in friends) {
      const friend = friends[key];
      arr.push(
        <ListItem
          onClick={() => {
            socket.readNotifications(friends[key].id);
            dispatch(defaultMessages());
            selectFriend(friends[key]);
            if (mediumScreen) {
              setChatWindow(true);
            }
          }}
          sx={{
            borderBottom: "1px solid #EBEBEB",
            width: "100%",
            cursor: "pointer",
            positon: "relative",
          }}>
          {notifications?.[friend.id] ? (
            <Box
              sx={{
                height: "25px",
                width: "25px",
                background: "darkred",
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                position: "absolute",
                zIndex: 4,
                borderRadius: "50%",
                border: "2px solid white",
                bottom: "4px",
                right: "0",
              }}>
              {notifications[friend.id].notifications}
            </Box>
          ) : null}

          <ListItemAvatar>
            <Box
              sx={{
                position: "relative",
                background: friend?.src
                  ? `url(${friend.src})`
                  : "url(https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-user-image-179582665.jpg)",
                height: "50px",
                width: "50px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: "50%",
              }}>
              <Box
                sx={{
                  height: "13px",
                  width: "13px",
                  background: `${
                    friend?.socketId
                      ? friend.socketId !== ""
                        ? "green"
                        : "gray"
                      : "gray"
                  }`,
                  position: "absolute",
                  zIndex: 4,
                  borderRadius: "50%",
                  border: "2px solid white",
                  bottom: "4px",
                  right: "0",
                }}></Box>
            </Box>
          </ListItemAvatar>
          <ListItemText
            sx={{
              "& .MuiListItemText-secondary": {
                fontWeight: "bold",
              },
            }}
            primary={friend.name}
            secondary={
              friend?.socketId
                ? friend.socketId !== ""
                  ? "Online"
                  : "Offline"
                : "Offline"
            }
          />
        </ListItem>
      );
    }

    return arr;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <List
          sx={{
            width: "100%",

            bgcolor: "background.paper",
          }}>
          {friendList()}
        </List>
      </Grid>
    </Grid>
  );
};

export default FriendList;
