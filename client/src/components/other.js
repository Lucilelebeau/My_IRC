import React, { useState, useEffect } from 'react'

import Navbar from '../components/navbar.js'
import '../App.css'


function Other () {

  ///////TESTS///////////
  //states
  const [chien, setChien] = useState('darwin')
  const [chat, setChat] = useState('vide')

  //socket.emit('chien', chien)
  

  /*useEffect(() => {
    socket.on('result',chien =>{
      setChat(chien)
    })
  })*/

  ///////////////////////


  
  return (
    <div>
      <Navbar/>
      <div className="container">
        <h1>Other page</h1>
        <p>{chat}</p>
      </div>
    </div>
  )

}

export default Other