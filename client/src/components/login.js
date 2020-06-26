import React from 'react'
import Container from '@material-ui/core/Container'
import "bootstrap/dist/css/bootstrap.min.css"
import { Row, Form, Button } from 'react-bootstrap';
import '../css/login.css'
import logo from '../assets/logo.jpg';
import socket from './connect.js'

class Login extends React.Component{
  constructor() {
    super()
    this.state = {login: ''};
    this.textInput = React.createRef(); 
    this.handleChange = this.handleChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  handleChange(){
    const value = this.textInput.current.value;
    this.setState({login: value});
  }

  onLoginSubmit(event){
    console.log(this.state.login)
    let login = this.state.login;
    socket.emit('/nick', login)
    this.props.history.push('/home', {login: login});
    event.preventDefault();
  }
 
  render(){
    return (
      <Container>
        <Row className="justify-content-md-center">
          <h1>Start a new chat on Disputes</h1>
        </Row>
        <Row className="justify-content-md-center">
          <Form id="color" onSubmit={this.onLoginSubmit}>
            <Form.Group controlId="Login">
              <Form.Label>Login</Form.Label>
              <Form.Control ref={ this.textInput} name ="login" onChange={this.handleChange} type="text" required={true}/>
            </Form.Group>
  
            <div className="buttonLog">
            <Button variant="dark" type="submit">Login</Button>
            </div>
          </Form>
        </Row>
        <div className="welcome_logo">
            <img className="images" src={logo} alt="logo"/>
        </div>
      </Container>
    )
  }
  
}

export default Login