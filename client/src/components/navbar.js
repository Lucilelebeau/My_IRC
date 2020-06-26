import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css"
import logo from '../assets/logo.jpg';

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div>
        <a className="navbar_title" href="/home">My_Dispute</a>
      </div>
      <div>
        <li><a className="navbar_liens" href="/edit">Edit login</a></li>
      </div>
      <div>
        <li><a className="navbar_liens" href="/login">Disconnect</a></li>
      </div>
      <div>
        <img src={logo} className="images_navbar" alt="logo"/>
      </div>
    </nav>  
  )
}

export default Navbar
