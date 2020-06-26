import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../css/home.css'
import Navbar from '../components/navbar.js'
import Chat from './chat.js'
import socket from './connect.js'
import Room from './room.js'
import ListUsers from './listUser.js'


function Home(history){
    const nameLog = history.location.state.login
    const time = new Date().toLocaleString()

    const [actualRoom, setActualRoom] = useState([])
    socket.on('actualRoom', room => {
      setActualRoom(room)
    })

    const [chat, setChat] = useState({ message: '', name: nameLog, type:'send', room:'', date: time, roomMsg: actualRoom})


    const onMessageSubmit = e => {
        e.preventDefault()
        console.log(actualRoom)
        const { name, message, type, date, roomMsg } = chat
        socket.emit('message', { name, message, type, actualRoom, date, roomMsg})
        setChat({ message: '', name, type , actualRoom, date: time, roomMsg: actualRoom})
        
    }

    const onTextChange = e => {
        setChat({ ...chat, [e.target.name]: e.target.value })
    }

    
    return(
        <div>
            <Navbar/>
            <Container fluid className="container_size">
                <Row>
                    <Col xs={3} className="channel">
                       <Room/>
                    </Col>
                    <Col xs={6} className="col_chat">
                        <Chat/>
                        <Form className="form_size" onSubmit={onMessageSubmit}>
                            <Form.Group className="form">
                                <Form.Label className="form"><b>"{chat.name}"</b> say :</Form.Label>
                                <Form.Control type="text" name="message" value={chat.message} onChange={e => onTextChange(e)}/>
                            </Form.Group>
                            <Button className="button" variant="dark" type="submit">
                                Send
                            </Button>
                        </Form>
                    </Col>
                    <Col xs={3} className="list">
                        <h3>List connected</h3>
                        <ListUsers/>
                    </Col>
                </Row>
            </Container>            
        </div>
    )
    
}

export default Home