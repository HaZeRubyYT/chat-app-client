import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import ContactWindow from "./components/contact-window/ContactWindow.jsx";
import Form from "./components/login-page/Form.jsx";

function App() {
  const [isLogin, setLogin] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, changeMessage] = useState("Hi");
  const [input, setInput] = useState("");
  const [myUsername, setMyUsername] = useState();
  const [allUsername, setAllUsernames] = useState([]);
  // const [senderName, setSenderName] = useState();
  // const [allMessages, setAllMessages] = useState([]);

  function changeInput(e) {
    setInput(e.target.value);
  }
  function changeLoginState() {
    setLogin(prevValue => !prevValue);
    console.log(isLogin);
  }
  // Function call for sending a message
  function sendMessage() {
    if (socket) {
      socket.emit("sent message", input, myUsername);
      setInput("");
    }
  }

  // useEffect for main socket
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {});
    setSocket(newSocket);

    // Function call to let the server allow a username
    newSocket.on("connect", () => {
      newSocket.emit("login");
    });

    // Function call to get usernames
    newSocket.on("get username", list => {
      setAllUsernames(list);
      for (let obj of list) {
        if (obj.id == newSocket.id) {
          setMyUsername(obj.user);
        }
      }
    });

    // Function call for recieving messages
    newSocket.on("chat message", message => {
      console.log(`Received message: ${message}`);
      changeMessage(message);
      // setSenderName(sender);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return isLogin ? (
    <div className="flex justify-between h-[100vh] w-[100vw] bg-[#212121] py-[2vh] px-[2vw] text-white">
      <ContactWindow myUsername={myUsername} />
      <ChatWindow
        message={message}
        myUsername={myUsername}
        allUsername={allUsername}
        sendMessage={sendMessage}
        changeInput={changeInput}
        input={input}
        socket={socket}
      />
    </div>
  ) : (
    <Form changeLoginState={changeLoginState} socket={socket} />
  );
}

{
  /* <div className="flex justify-between h-[100vh] w-[100vw] bg-[#212121] py-[2vh] px-[2vw] text-white">
        <ContactWindow myUsername={myUsername} />
        <ChatWindow
          message={message}
          myUsername={myUsername}
          allUsername={allUsername}
          sendMessage={sendMessage}
          changeInput={changeInput}
          input={input}
          socket={socket}
        />
      </div> */
}

export default App;
