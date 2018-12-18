import React, { Component } from "react";

class SendMessageForm extends Component {
  constructor() {
    super();

    this.state = {
      message: ""
    };
  }

  handleChange = e => {
    // console.log(e.target.value);
    this.setState({ message: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.message);
    this.props.sendMessage(this.state.message);
    this.setState({
      message: ""
    });
    //Send off the message
  };

  render() {
    return (
      <form className="send-message-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.message}
          placeholder="Type your message and hit ENTER"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default SendMessageForm;
