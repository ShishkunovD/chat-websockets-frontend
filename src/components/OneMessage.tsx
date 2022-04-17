type TOneMessgae = {
    mess: {
      username: string,
      id: number,
      event: string,
      message: string
    }
}

const OneMessage = ({mess}: TOneMessgae) => {
  return(
    <div key={mess.id}>
      {mess.event === 'connection' ?
        <div>Пользователь {mess.username} подключился</div> :
        <div>{mess.username}: {mess.message}</div>}
    </div>
  )
}

export default OneMessage;