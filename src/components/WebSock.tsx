import { useState, useRef, useEffect } from "react";
import OneMessage from "./OneMessage";
import '../style/Messages.scss';
import { useAudio } from "react-awesome-audio";
const song = require("../song/song.mp3");

const WebSock = () => {

  const [messages, setMessage] = useState<any>([]);
  const [value, setValue] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  
  const [username, setUserName] = useState<string>('');

  const socket = useRef<any>();
  const inputMessage = useRef<any>();
  const chatMessgae = useRef<any>();

  const { isPlaying, play, pause, toggle } = useAudio({
    src: song,
    loop: false,
  });

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message));
    }
    
    socket.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      setMessage((prevMessage: any) => [...prevMessage, message])
    }
    
    socket.current.onclose = () => {
      console.log('Socket закрыт');
    }
    
    socket.current.onerror = () => {
      console.log('Socket выдал ошибку');
    }    
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }
    if(value.length) {
      socket.current.send(JSON.stringify(message));
      setValue('');
      inputMessage.current.focus();
    } else {
      alert('Сообщение не может быть пустым'); // заменить на нормальный Alert через библиотеку
      inputMessage.current.focus();
    }
  }

  const sendMessageEnter = (e: any) => {
    if(e.key === 'Enter') {
      const message = {
        username,
        message: value,
        id: Date.now(),
        event: 'message'
      }
      if(value.length) {
        socket.current.send(JSON.stringify(message));
        // chatMessgae.current.scrollTop = chatMessgae.current.scrollHeight - chatMessgae.current.clientHeight;
        console.log(chatMessgae.current.scrollHeight);
        console.log(chatMessgae.current.clientHeight);
        setValue('');
        inputMessage.current.focus();
      } else {
        alert('Сообщение не может быть пустым'); // заменить на нормальный Alert через библиотеку
        inputMessage.current.focus();
      }
    }
  }

  useEffect(() => {
    
  }, [messages])

  // useEffect(() => {
  //   messages[messages.length - 1].scrollIntoView({block: "center", behavior: "smooth"});
  // }, [messages]);

  if(!connected) {
      return(
        <div className="input-container">
          <div className="input-button">
            <input
              className="input"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Введите имя" />
            <button onClick={connect} className="button">Войти</button>
          </div>
        </div>
      )
  }

  const getTextInput = (e: any) => {
    setValue(e.target.value);
  }

  const check = (e: any) => {
    console.log(e.target.selectionStart)
    toggle();
  }
  
  return(
    <div className="chat-container">
        <div 
          className="chat-messages"
          ref={chatMessgae}>
          {messages.map((mess: any) => <OneMessage key={mess.id} mess={mess} username={username}/>)}
        </div>
        <div className="input-container">
          <div className="input-button">
            <input
              ref={inputMessage}
              className="input"
              value={value}
              onChange={(e) => getTextInput(e)}
              onKeyDown={(e) => sendMessageEnter(e)}
              onClick={(e) => check(e)}
            />
            <button className="button" onClick={sendMessage}>Отправить</button>
            <button onClick={toggle}>{isPlaying ? "Pause" : "Play"}</button>
          </div>
        </div>
    </div>
  )
}

export default WebSock;