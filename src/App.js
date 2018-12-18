import React, { Component } from "react";
import Chatkit from "@pusher/chatkit-client";
import "./App.css";

import MessageList from "./components/MessageList";
// import SendMessageForm from "./components/SendMessageForm";
// import RoomList from "./components/RoomList";
// import NewRoomForm from "./components/NewRoomForm";

import { tokenUrl, instanceLocator } from "./config/Config";

class App extends Component {
  constructor() {
    super();

    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: "taraghe",
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    chatManager.connect().then(currentUser => {
      currentUser.subscribeToRoom({
        roomId: "19378874",
        hooks: {
          onNewMessage: message => {
            console.log("message.text: ", message.text);
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      });
    });
  }
  render() {
    return (
      <div className="app">
        {/* <RoomList /> */}
        <MessageList />
        {/* <SendMessageForm />
        <NewRoomForm /> */}
      </div>
    );
  }
}

export default App;
