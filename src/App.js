import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Route, Switch, Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

import ProfileContainer from './Containers/ProfileContainer';
import About from './Static/About';
import FractalMachine from './Containers/FractalMachine';
import Gallery from './Containers/Gallery';
import NavBar from './Components/NavBar'
import Form from './Components/Form';
import NotFound from './Static/NotFound';

class App extends React.Component {

  state = {
    user: {
      username: "",
      id: 0
    },
    token: ""
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {

      fetch("http://localhost:4000/persist", {
        headers: {
          "Authorization": `Bearer ${localStorage.token}`
        }
      })
        .then(r => r.json())
        .then(this.handleResp)
    }
  }

  handleResp = (resp) => {
    if (resp.user) {
      localStorage.token = resp.token
      this.setState(resp, () => {
        this.props.history.push("/")
        console.log(this.state)
      })
    }
    else {
      alert(resp.error)
    }
  }
  
  handleLoginSubmit = (userInfo) => {
    return fetch(`http://localhost:4000/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(userInfo)
    })
      .then(res => res.json())
      .then(this.handleResp)
  }

  handleRegisterSubmit = (userInfo) => {
    fetch('http://localhost:4000/users', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(userInfo)
    })
    .then( resp => resp.json() )
    .then( this.handleResp )
  }

  handleLogOut = () => {
    localStorage.clear()
    this.setState({
        user: {
          username: "",
          id: 0
        },
        token: ""
    }, () => {
      this.props.history.push("/")
    })
  }

  renderForm = (routerProps) => {
    if(routerProps.location.pathname === "/login"){
      return <Form formName="Login Form" handleSubmit={this.handleLoginSubmit}/>
    } else if (routerProps.location.pathname === "/register") {
      return <Form formName="Register Form" handleSubmit={this.handleRegisterSubmit}/>
    }
  }

  renderProfile = (routerProps) => {
    return  <ProfileContainer currentUser={this.state.user} token={this.state.token} />
  }

  render() {
    return (
      <div className="App">
        <NavBar currentUser={this.state.user} handleLogOut={this.handleLogOut} />
        <Switch>
          <Route path="/login" render={ this.renderForm } />
          <Route path="/register" render={ this.renderForm } />
          <Route path="/about" component={ About } />
          <Route path="/gallery" component={ Gallery } />
          <Route path="/profile" render={ this.renderProfile } />
          <Route path="/" exact component={ FractalMachine } />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);