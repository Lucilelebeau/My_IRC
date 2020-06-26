import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import '../css/home.css'
import socket from './connect.js'

function Chat(){

    const [chatArray, setChatArray] = useState([])
    
    useEffect(() => {
        socket.on('message', ({ name, message, type, date, roomMsg }) => {
          setChatArray([...chatArray, { name, message, type, date, roomMsg }])
        })
    })

    const [actualRoom, setActualRoom] = useState([])
    socket.on('actualRoom', room => {
      setActualRoom(room)
    })

    const renderChat = () => {

        return chatArray.map(({ name, message, type, date, roomMsg }, index) => (
          <div key={index}>
            <h4 className={type}>
              {name} <span className="from">{roomMsg} </span><span className="date_mess">{date}</span><br></br>
              <span className="text_mess"> {message}</span>
            </h4>
          </div>
        ))
      }

    return(
        <div>
            <h3 className="titleChat">{chatArray.name}Chat : <b>{actualRoom}</b> room</h3>
            <div className="chat_size">
                {renderChat()}
            </div>
        </div>
    )
}

export default Chat