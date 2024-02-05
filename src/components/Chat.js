import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getHours(),
      };
      await socket.emit("sendMessage", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div
                className='message'
                id={username === messageContent.sender ? "you" : "other"}>
                <div>
                  <div className='message-meta'>
                    <p id='author'>{messageContent.sender}</p>
                  </div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='Type your message here'
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
