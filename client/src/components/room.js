import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { Form } from 'react-bootstrap'
import '../css/home.css'
import ListRooms from './listRooms.js'
import socket from './connect.js'


function Room(){

    const [room, setRoom] = useState()

    const onCreateSubmit = e => {
        e.preventDefault()
        socket.emit('/create', room)

    }

    const onTextChange = e => {
        setRoom(e.target.value)
    }

    return(
        <div>
            <h3 className="titleChat">Channel</h3>
            <ListRooms/>
            <Form className="form_channel" onSubmit={onCreateSubmit}>
                <label>Create new room :</label>
                <input className="inputs_channel" name='room' placeholder="name of your room" type='text' onChange={e => onTextChange(e)} required></input>
                <button className="buttons_channel" type="submit">Add</button>
            </Form>
        </div>
    )
}

export default Room