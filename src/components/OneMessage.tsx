import { SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import getUserName from '../Redux/toolkitSlice';
import '../style/OneMessage.scss';

type TOneMessgae = {
    mess: {
      username: string,
      id: number,
      event: string,
      message: string
    }
    username: string
}

const OneMessage = ({ mess, username }: TOneMessgae) => {

  const dispatch = useDispatch<any>();

  // useEffect(() => {
  //   dispatch(getUserName(username)); // Вот здесь проблема, надо решать!!!
  // }, [])

  return(
    <div key={mess.id}>
      {mess.event === 'connection' ?
        <div className="user-connect"><span>Пользователь {mess.username} подключился</span></div> :
        <div className={username === mess.username ? "my-message": "another-message"}><span>{mess.username}</span>: <div>{mess.message}</div></div>}
    </div>
  )
}

export default OneMessage;