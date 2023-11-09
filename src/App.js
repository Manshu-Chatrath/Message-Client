import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setAuth } from "reducers/authSlice";
import io from "socket.io-client";
import Socket from "services/socket";
import Main from "pages/main";

import LogIn from "pages/login";
import { isExpired } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "reducers/socketSlice";
import SignUp from "pages/signup";
import { getSignedInUser } from "reducers/userSlice";
import { userApiSlice } from "reducers/apiSlice";
const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.users.user);
  const webSocket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    if (!isExpired(localStorage.getItem("token"))) {
      dispatch(
        setAuth({
          token: localStorage.getItem("token"),
        })
      );
    }
  }, []);

  const logOut = () => (webSocket ? webSocket.logout() : null);

  useEffect(() => {
    if (!isExpired(token)) {
      userApiSlice.defaults.headers.common["Authorization"] = token;
      if (user) {
        try {
          const socket = io.connect("http://www.messaging-app-prod.chat/", {
            query: {
              token: token,
            },
          });

          const socketIo = new Socket(socket, user.id);
          dispatch(setSocket(socketIo));
          socketIo.getRecentMessage();
          socketIo.getRecentNotification();
          socketIo.getAllFriendRequests();
          socketIo.getAllNotifications();
          socketIo.connectToServer(user.id);
          socketIo.sentRequest();
          socketIo.getFriends();
        } catch (er) {
          console.log(er);
        }
      } else {
        dispatch(getSignedInUser());
      }
    }
  }, [token, user]);

  return (
    <BrowserRouter>
      <Routes>
        {!isExpired(token ? token : localStorage.getItem("token")) ? (
          <>
            <Route path="/" element={<Main />}></Route>
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            {logOut()}
            <Route path="*" element={<Navigate replace to="/login" />} />
          </>
        )}
        <Route index path="login" element={<LogIn />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
