import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import '../css/home.css'
import socket from './connect.js'

function ListRooms(){

    // Affiche List Room
    const [listRooms, setListRooms] = useState([])
    socket.on('/list', listRooms => {
      setListRooms(listRooms, listRooms)
    })

    // Room join
    const [listRoomsUser, setListRoomsUser] = useState([])
    socket.on('listRoomsUser', listRoomsUser => {
      setListRoomsUser(listRoomsUser, listRoomsUser)
    })


    const onRoomJoin = room => {
      console.log(room + " : join")
      socket.emit('/join', room)
    }

    // Room Leave
    const onRoomLeave = room => {
      console.log(room + " : leave")
      socket.emit('/part', room)
    }

    // Room Edit
    const onRoomEdit = room => {
      const newNameRoom = prompt('Please enter the new name of your room')
      console.log(room + " : edit")
      console.log(newNameRoom)
      socket.emit('/editRoom', {room, newNameRoom})
    }

    // Room change
    const onRoomChange = room => {
      console.log(room + " : change")
      socket.emit('/change', room)
    }

    // Delete Room
    const onRoomDelete = room => {
      console.log(room + " : delete")
      socket.emit('/delete', room)
    }

    
    const renderListCreate = () => {
      return listRooms.map((room, index) => (
        <div className="room_button" key={index}>
          <h4 className="room">
            {room}
          </h4>
            <button className="buttons_grey" type="submit" onClick={()=>onRoomChange(room)}>use</button>
            <button className="buttons_grey" type="submit" onClick={()=>onRoomJoin(room)}>join</button>
            <button className="buttons_grey" type="submit" onClick={()=>onRoomLeave(room)}>leave</button>
            <button className="buttons_grey" type="submit" onClick={()=>onRoomEdit(room)}>edit</button>
            <button className="buttons_grey" type="submit" onClick={()=>onRoomDelete(room)}>delete</button>
        </div>
      ))
    }

    return(
      <div className="list_rooms">
          {renderListCreate()}
      </div>
    )
}

export default ListRooms