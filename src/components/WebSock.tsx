import { useState, useRef } from "react";
import OneMessage from "./OneMessage";

const WebSock = () => {

  const [message, setMessage] = useState<any>([]);
  const [value, setValue] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  
  const [username, setUserName] = useState<string>('');

  const socket = useRef<any>();

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
      setMessage((prevMessage: any) => [message, ...prevMessage])
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
    socket.current.send(JSON.stringify(message));
    setValue('');
  }

  if(!connected) {
      return(
        <div className="input-container">
          <div className="input-button">
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Введите имя" />
            <button onClick={connect} className="enter-button">Войти</button>
          </div>
        </div>
      )
  }

  const getTextInput = (e: any) => {
    setValue(e.target.value);
  }

  const check = (e: any) => {
    console.log(e.target.selectionStart)
  }
  
  return(
    <div className="chat-container">
        <div className="input-container">
          <input value={value} onChange={(e) => getTextInput(e)} onClick={(e) => check(e)}/>
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div>
          {message.map((mess: any) => < OneMessage key = {mess.id} mess={mess}/>)}
        </div>
    </div>
  )
}

export default WebSock;