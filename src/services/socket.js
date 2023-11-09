import { store } from "reducers/index";
import {
  setFriends,
  resetFriends,
  getAllMessages,
  recentMessage,
  setNotifications,
  allSentRequests,
  setFriendRequests,
  recentNotification,
} from "reducers/socketSlice";
class Socket {
  constructor(socket, userId) {
    this.socket = socket;
    this.userId = userId;
  }
  connectToServer(userId) {
    this.socket.emit("online", { userId });
  }

  getFriends() {
    this.socket.emit("friends");
    this.socket.on("friends", (data) => {
      store.dispatch(setFriends(data));
    });

    this.socket.on("onlineFriends", (friend) => {
      if (this.userId !== friend.id) {
        store.dispatch(resetFriends(friend));
      }
    });

    this.socket.on("offlineFriend", (friend) => {
      if (this.userId !== friend.id) {
        store.dispatch(resetFriends(friend));
      }
    });
  }

  sendMessage({ senderId, recipientId, message }) {
    this.socket.emit("sendMessage", { senderId, recipientId, message });
    this.socket.emit("sendNotification", {
      sentBy: senderId,
      recievedBy: recipientId,
      type: "message",
    });
  }

  getMessages({ senderId, recipientId }) {
    this.socket.emit("getMessages", { senderId, recipientId });
    this.socket.on("getMessages", (data) => {
      store.dispatch(getAllMessages(data));
    });
  }

  getRecentMessage() {
    this.socket.on("getRecentMessage", (data) => {
      store.dispatch(recentMessage(data));
    });
  }

  getRecentNotification() {
    this.socket.on("getRecentNotification", (data) => {
      store.dispatch(recentNotification(data));
    });
  }

  getAllNotifications() {
    this.socket.emit("getAllNotifications", this.userId);
    this.socket.on("getAllNotifications", (data) => {
      store.dispatch(setNotifications(data));
    });
  }

  getAllFriendRequests() {
    this.socket.emit("allFriendRequests", this.userId);
    this.socket.on("allFriendRequests", (data) => {
      store.dispatch(setFriendRequests(data));
    });
  }

  readNotifications(sentBy) {
    this.socket.emit("readNotification", {
      sentBy,
      recievedBy: this.userId,
    });
  }

  acceptRequest(senderId) {
    this.socket.emit("acceptRequest", {
      receiverId: this.userId,
      senderId,
    });
  }

  addFriend(friendId) {
    this.socket.emit("addFriend", {
      sentBy: friendId,
      recievedBy: this.userId,
    });
  }

  sentRequest() {
    this.socket.emit("sentRequest", this.userId);
    this.socket.on("sentRequest", (data) => {
      store.dispatch(allSentRequests(data));
    });
  }

  logOut() {
    this.socket.emit("logout", this.userId);
  }
}

export default Socket;
