// Your frontend starts here..sfas
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'

import 'bulma'
import './styles/style.scss'

import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/common/Navbar'
import Home from './components/Home'


const App = () => (

  <HashRouter>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      {/* <Route exact path='/register/usertype' component={UserType} /> */}

    </Switch>
  </HashRouter>

)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)