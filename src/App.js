import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './components/Chat';

const socket = io.connect("http://localhost:3001");

function App() {

  const [username,setUsername] = useState("");
  const [room,setRoom] = useState("");
  const [showChat,setShowChat] = useState(false);

  const joinRoom = () =>{
    if(username !== "" && room !== ""){
      socket.emit('joinRoom',room);
      setShowChat(true);
    }
  }

  return (
    <>
    <div className='App'>
      {!showChat ? (
      <div className="joinChatContainer">
      <h3>Join Chat</h3>
      <input type="text" id="username" placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}}/>
      <input type="text" id="room" placeholder="room" onChange={(e)=>{setRoom(e.target.value)}}/>
      <button type="button" onClick={joinRoom}>Join a room</button>
      </div>
      ):(
      <Chat socket={socket} username={username} room={room}/>
      )}
      </div>
    </>
  );
}

export default App;
