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
import AddProfileImage from './components/AddProfileImage'
import CreateResidence from './components/CreateResidence'
import JoinRequest from './components/JoinRequest'
import CreateExpense from './components/CreateExpense'
import ViewResidenceUser from './components/ViewResidenceUser'
import ViewExpense from './components/ViewExpense'
import AddBillImage from './components/AddBillImage'
import HouseShareWelcome from './components/HouseShareWelcome'


const App = () => (

  <HashRouter>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path='/HouseShareWelcome' component={HouseShareWelcome} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/addProfileImage' component={AddProfileImage} />
      <Route exact path='/addBillImage/:expense_id' component={AddBillImage} />
      <Route exact path='/createResidence' component={CreateResidence} />
      <Route exact path='/joinRequest' component={JoinRequest} />
      <Route exact path='/expense/new' component={CreateExpense} />
      <Route exact path='/viewResidenceUser' component={ViewResidenceUser} />
      <Route exact path='/viewExpense/:expense_id' component={ViewExpense} />

      {/* <Route exact path='/register/usertype' component={UserType} /> */}

    </Switch>
  </HashRouter>

)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)