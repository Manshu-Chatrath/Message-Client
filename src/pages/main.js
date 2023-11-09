import React, { useEffect, useState, useMemo } from "react";

import Header from "components/Header";
import { Grid, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Input from "components/Input";
import SearchBar from "components/SearchBar";
import { useSelector } from "react-redux";
import FriendList from "components/FriendList";
const Main = () => {
  const user = useSelector((state) => state.users.user);
  const [friend, selectedFriend] = useState(null);
  const mediumScreen = useMediaQuery("(max-width:740px)");
  const [chatWindow, setChatWindow] = useState(false);

  const notifications = useSelector((state) => state.socket.notifications);

  const socket = useSelector((state) => state.socket.socket);
  const friendRequests = useSelector((state) => state.socket.friendRequests);
  const sentRequests = useSelector((state) => state.socket.sentRequests);

  const header = useMemo(() => {
    return (
      <Grid
        lg={4}
        md={6}
        sm={mediumScreen ? 12 : 6}
        xs={12}
        item
        sx={{
          borderRight: "1px solid black",
          minHeight: "100vh",
          position: "relative",
        }}>
        <Header
          friendRequests={friendRequests}
          title={"chats"}
          socket={socket}
          user={user}
        />
        <SearchBar
          user={user}
          sentRequests={sentRequests}
          socket={socket}
          friendRequests={friendRequests}
        />
        <FriendList
          mediumScreen={mediumScreen}
          setChatWindow={setChatWindow}
          socket={socket}
          notifications={notifications}
          user={user}
          friendRequests={friendRequests}
          selectedFriend={selectedFriend}
        />
      </Grid>
    );
  }, [
    socket,
    notifications,
    user,
    friendRequests,
    sentRequests,
    selectedFriend,
    mediumScreen,
  ]);

  const chatModal = useMemo(() => {
    return (
      <Grid item lg={8} md={6} sm={mediumScreen ? 12 : 6} xs={12} container>
        <Grid xs={12} sx={{ height: "auto" }} item>
          {friend ? (
            <Header
              mediumScreen={mediumScreen}
              setChatWindow={setChatWindow}
              socket={socket}
              title={"messages"}
              user={friend}
            />
          ) : null}
        </Grid>
        <Grid xs={12} sx={{ height: "90vh", position: "relative" }} item>
          {friend ? (
            <Input user={user} socket={socket} friend={friend} />
          ) : null}
        </Grid>
      </Grid>
    );
  }, [socket, user, friend, mediumScreen]);

  return (
    <>
      {user ? (
        <Grid container sx={{ position: "relative" }}>
          {mediumScreen ? (!chatWindow ? header : null) : header}
          {mediumScreen ? (chatWindow ? chatModal : null) : chatModal}
        </Grid>
      ) : null}
    </>
  );
};

export default Main;
