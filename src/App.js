import React, { Component } from "react";
import Chatkit from "@pusher/chatkit-client";
import "./App.css";

import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";

import { tokenUrl, instanceLocator } from "./config/Config";

class App extends Component {
  constructor() {
    super();

    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    };
  }

  componentDidMount() {
    const tokenProvider = new Chatkit.TokenProvider({
      url: tokenUrl
    });
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: "taraghe",
      tokenProvider: tokenProvider
    });

    chatManager
      .connect()
      .then(currentUser => {
        // console.log("Connected as user ", currentUser);
      })
      .catch(error => {
        console.log("error:", error);
      });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(error => {
        console.error("error on connecting: ", error);
      });
  }

  subscribeToRoom = roomId => {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoom({
        roomId: roomId,
        hooks: {
          onMessage: message => {
            // console.log(`Received new message: ${message.text}`);
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });
        this.getRooms();
      })
      .catch(err => console.log("error on subscrbing to room: ", err));
  };

  getRooms = () => {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        });
      })
      .catch(err => console.log("error on joinableRooms:", err));
  };

  sendMessage = text => {
    this.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    });
  };

  createRoom = name => {
    this.currentUser
      .createRoom({
        name
      })
      .then(room => this.subscribeToRoom(room.id))
      .catch(err => console.log("error with create room: ", err));
  };

  render() {
    return (
      <div className="app">
        <RoomList
          roomId={this.state.roomId}
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
        />
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages}
        />
        <SendMessageForm
          disabled={!this.state.roomId}
          sendMessage={this.sendMessage}
        />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
