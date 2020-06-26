import React from 'react'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Welcome from '../components/welcome.js'
import Login from '../components/login.js'
import Home from '../components/home.js'
import Edit from '../components/edit.js'


function Navigator() {

    return  (
      <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route path="/edit" component={Edit} />
            <Route path="/home" component={Home} />
            
          </Switch>
      </Router>
    )
}

export default Navigator