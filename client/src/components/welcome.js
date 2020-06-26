import React from 'react'
import ReactAudioPlayer from 'react-audio-player';
import musique from '../assets/musique.mp3'
import logo from '../assets/logo.jpg';
import '../css/welcome.css'


function Welcome() {

  return (
      <div className="container welcome">
        <ReactAudioPlayer src={musique} autoPlay loop/>
        <div className="welcome_title">
          <h1>Welcome to Disputes !</h1>
        </div>
        <div className="welcome_logo" >
          <img src={logo} alt="logo"/>
        </div>
        <div className="welcome_button" >
          <button><a className= "welcome_link" href="/login">Entrez</a></button>
        </div>
      </div>
  )
}

export default Welcome
