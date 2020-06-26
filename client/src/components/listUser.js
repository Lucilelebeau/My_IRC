import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import '../css/home.css'
import socket from './connect.js'

function ListUsers(){

    const [listUsers, setListUsers] = useState([])
    socket.on('/users', listUsers => {
      setListUsers(listUsers, listUsers)
    })

    const [actualRoom, setActualRoom] = useState([])
    socket.on('actualRoom', room => {
      setActualRoom(room)
    })

    const [RoomUsers, setRoomUsers] = useState([])
    socket.on('/roomUsers', list => {
      list.forEach(element => {
        console.log(actualRoom)
        if(element.channel==actualRoom){
          console.log(element)
          let finalList = element.users
          setRoomUsers([finalList])    
        }
      });
    })

    const renderList = () => {
        return listUsers.map((user, index) => (
          <div key={index}>
            <h4 className="user_list">
              {user}
            </h4>
          </div>
        ))
      }

    const renderListRoom = () => {
      return RoomUsers.map((user, index) => (
        <div key={index}>
          <h4 className="user_list">
            {user}
          </h4>
        </div>
      ))
    }


    return(
      <div>
        <div className="list_names">
            {renderList()}
        </div>
        <div className="list_names">
            <div>In this channel {actualRoom} :</div>
            {renderListRoom()}
        </div>
      </div>
    
    )
}

export default ListUsers