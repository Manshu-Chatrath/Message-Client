import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ListItemAvatar,
  Button,
  IconButton,
  Popover,
  Avatar,
} from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { useSelector } from "react-redux";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import UserEdit from "components/UserEdit";
import ListItemText from "@mui/material/ListItemText";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
const Header = ({
  title,
  friendRequests,
  user,
  socket,
  mediumScreen = null,
  setChatWindow,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  const [isEdit, setEdit] = useState(false);
  const openModal = (e) => {
    setAnchorEl(e.currentTarget);
    setOpen(true);
  };

  const goBack = () => {
    setChatWindow(false);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleClick = (id) => (e) => {
    socket.acceptRequest(id);
  };

  const modal = () => {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <List
          sx={{
            maxHeight: "200px",
            overflow: "auto",
            zIndex: 100,
            width: "400px",
            background: "#F0F2F5",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",

            left: 0,
          }}>
          {Object.keys(friendRequests).map((key) => {
            const req = friendRequests[key];
            return (
              <ListItem
                id={req.id}
                data-modal="userModal"
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
                    onClick={handleClick(req.id)}
                    variant="contained">
                    Accept
                  </Button>
                }>
                <ListItemAvatar>
                  <Avatar>
                    <Box
                      sx={{
                        position: "relative",
                        background: req?.src
                          ? `url(${req.src})`
                          : "url(https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-user-image-179582665.jpg)",
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
                  primary={req.name}
                />
              </ListItem>
            );
          })}
        </List>
      </Popover>
    );
  };
  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid #D3D3D3",
          width: "100%",
        }}>
        <Grid justifyContent={"space-between"} container>
          <Grid
            sx={{ alignItems: "center", margin: "0 20px", padding: "20px 0px" }}
            item
            xs={title === "messages" ? 12 : 6}
            container>
            {title === "messages" && mediumScreen ? (
              <Grid item>
                <KeyboardBackspaceIcon
                  onClick={goBack}
                  sx={{ marginRight: "10px" }}
                />
              </Grid>
            ) : null}
            <Grid item>
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
                }}>
                <Box
                  sx={{
                    height: "13px",
                    width: "13px",
                    background: `${
                      title === "messages"
                        ? user?.socketId
                          ? user?.socketId !== ""
                            ? "green"
                            : "gray"
                          : "gray"
                        : "green"
                    }`,
                    position: "absolute",
                    borderRadius: "50%",
                    border: "2px solid white",
                    bottom: "4px",
                    right: "0",
                  }}></Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography
                variant="span"
                sx={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}>
                {title === "messages" ? user?.name : user?.name}
              </Typography>
            </Grid>
          </Grid>
          {title === "messages" ? null : (
            <Grid
              sx={{
                alignItems: "center",
                marginRight: "20px",
                padding: "20px 0px",
              }}
              item
              xs={4}
              justifyContent={"flex-end"}
              container>
              {title === "messages" ? null : (
                <Grid item>
                  <IconButton
                    onClick={handleEdit}
                    sx={{ background: "#D9DAD5", color: "black" }}>
                    <SettingsIcon />
                  </IconButton>{" "}
                </Grid>
              )}
              {title === "messages" ? null : (
                <Grid item sx={{ marginLeft: "20px" }}>
                  <IconButton
                    onClick={openModal}
                    sx={{
                      background: "#D9DAD5",
                      color: "black",
                      position: "relative",
                    }}>
                    <NotificationsIcon />
                    {Object.keys(friendRequests).length === 0 ? null : (
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
                          fontSize: "18px",
                          border: "2px solid white",
                          bottom: "-2px",
                          right: "-8px",
                        }}>
                        {Object.keys(friendRequests).length}
                      </Box>
                    )}
                  </IconButton>
                </Grid>
              )}
              {title === "messages"
                ? null
                : Object.keys(friendRequests).length > 0
                ? modal()
                : null}
            </Grid>
          )}
        </Grid>
        {isEdit ? (
          <>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 1000,
                background: "white",
              }}>
              <UserEdit user={user} userId={user.id} setEdit={setEdit} />
            </Box>
          </>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
