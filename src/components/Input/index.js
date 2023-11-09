import React, { useState, useEffect, useRef } from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { recentMessage } from "reducers/socketSlice";

import SendIcon from "@mui/icons-material/Send";
const Input = ({ user, friend, socket }) => {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => {
    return state.socket.messages;
  });

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, ref]);

  useEffect(() => {
    socket.getMessages({ senderId: user.id, recipientId: friend.id });
  }, [friend]);

  const messageList = () => {
    const arr = [];
    arr.push(
      messages.map((message, index) => {
        if (friend.id === message.senderId) {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                margin: "0 2%",
              }}>
              <Box
                sx={{
                  padding: "20px",
                  background: "#BCC0C4",
                  color: "black",
                  marginTop: "15px",
                  minWidth: "100px",
                  borderRadius: "80px",
                }}>
                {message.message}
              </Box>
            </Box>
          );
        }
        if (user.id === message.senderId) {
          return (
            <>
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "0 2%",
                }}>
                <Box
                  sx={{
                    padding: "20px",
                    background: "#20A3FA",
                    color: "white",
                    marginTop: "15px",
                    minWidth: "100px",
                    borderRadius: "80px",
                  }}>
                  {message.message}
                </Box>
              </Box>
            </>
          );
        }
      })
    );
    return arr;
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const onsubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      socket.sendMessage({
        senderId: user.id,
        recipientId: friend.id,
        message: text,
      });
      dispatch(
        recentMessage({
          senderId: user.id,
          recipientId: friend.id,
          message: text,
        })
      );
      setText("");
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  return (
    <>
      <Box ref={ref} sx={{ height: "90%", overflow: "auto", zIndex: 2 }}>
        {messageList()}
      </Box>

      <form
        style={{
          position: "absolute",
          bottom: "0px",
          width: "96%",
          height: "8%",
          margin: "0 2%",
          paddingBottom: "20px",
          zIndex: 100,
          background: "white",
        }}
        onSubmit={onsubmit}>
        <TextField
          placeholder="Send Message"
          onClick={() => socket.readNotifications(friend.id)}
          autoComplete="off"
          value={text}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SendIcon sx={{ color: "black" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",

            "& .MuiOutlinedInput-root": {
              borderRadius: "80px",
            },
          }}
        />
      </form>
    </>
  );
};

export default Input;
