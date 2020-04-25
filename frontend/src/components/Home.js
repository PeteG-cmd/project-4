
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import { Link } from 'react-router-dom'

import Moment, { now } from 'moment'
import Spinner from './common/Spinner'

import JoinRequest from './JoinRequest'



export default class Home extends React.Component {

  constructor() {
    super()

    this.state = {
      userProfile: null
    }
  }

  componentDidMount() {
    axios.get('/api/userprofile/', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.setState({ userProfile: res.data })
      })
      .catch(err => {
        this.setState({ error: err.response.data.message })
        // this.props.history.push('/houseShareWelcome')
      })
  }

  handleUpdate(event) {
    axios.get('/api/userprofile/', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.setState({ userProfile: res.data })
      })
      .catch(err => this.setState({ error: err.response.data.message }))
  }

  sortByDate(splits) {
    const newSplits = splits.map(split => {
      split.expense_dated = new Date(split.expense_dated)
      return split
    })
    const sortedSplits = newSplits.sort((a, b) => b.expense_dated - a.expense_dated)
    return sortedSplits
  }

  calculateDashboard() {
    if (!this.state.userProfile.residences[0]) return
    let openExpenses = 0
    let settledExpenses = 0
    this.state.userProfile.residences[0].expenses.map(expense => {
      expense.splits.map(split => {
        if (split.user.id === this.state.userProfile.id && split.paid_flag === true) {
          settledExpenses += split.percentage_to_pay
        } else if (split.user.id === this.state.userProfile.id && split.paid_flag === false) {
          openExpenses += split.percentage_to_pay
        }
      })
    })
    return { settledExpenses: settledExpenses, openExpenses: openExpenses }

  }

  render() {

    if (!this.state.userProfile) return <h1>Waiting</h1>
    const user = this.state.userProfile
    const dashData = this.calculateDashboard()

    console.log(this.state.userProfile)

    return <div>

      <div className="columns">
        <div className="column">
          {user.residences[0] && user.id === user.residences[0].admin_user.id && <div className="box has-text-centered growHeight">

            <h1 className="subtitle">Users Awaiting Approval</h1>
            <JoinRequest
              join_requests={user.residences[0].join_requests}
              residenceId={user.residences[0].id}
              handleUpdate={(event) => this.handleUpdate(event)}

            />

          </div>}
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <h1 className="title">Home</h1>
            <div>
              <div className='circleBox'>
                <p className="image is-100x100">
                  <img className='is-rounded' src={'http://localhost:4000/media/assets/round-logo-1.jpg'}></img>
                </p>
              </div>
              <div>
                {!user.residences[0] && !user.new_residence[0] && <p><Link to={'/createResidence'}>Click the house to get started...</Link></p>}
                {/* {user.residences[0] && <p>House, click to see info</p>} */}
                {user.new_residence[0] && <p>Awaiting approval from Admin</p>}
              </div>
            </div>
            <div className="lineBox"></div>
            <div>
              <div className='circleBox'>
                <Link to={'/addProfileImage'}>
                  <p className="image is-100x100">
                    {user.image && <img className='is-rounded' src={`http://localhost:4000${user.image}`}></img>}
                    
                    {!user.image && <img className='is-rounded' src={'project/media/assets/user-placeholder.jpg'}></img>}
                    {/* project/media/assets/user-placeholder.jpg */}
                  </p>
                </Link>
              </div>
              <div>
                Click to update...
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered growHeight dashboard">
            <h1 className="subtitle">Dashboard</h1>
            <p>Current balance: £</p>
            {user.residences[0] && <p>Open Expenses: £{dashData.openExpenses.toFixed(2)}</p>}
            {user.residences[0] && <p>Settled Expenses: £{dashData.settledExpenses.toFixed(2)}</p>}
            {!user.residences[0] && user.splits[0] && <button className='button is-warning is-full-width'>See Expenses from previous House</button>}

            <p></p>
          </div>
        </div>
      </div>


      <div className="columns is-multiline is-mobile">
        {user.residences[0] && user.residences[0].tenants.map((tenant, index) => {
          return <div key={index} className="column is-3-desktop is-4-tablet is-half-mobile has-text-centered">
            <Link to={{ pathname: '/viewResidenceUser', state: tenant }}><div className="box">
              <p>{tenant.username}</p>
              <div className='circleBox'>
                {!tenant.image && <p className="image is-100x100">
                  <img className='is-rounded' src={'http://localhost:4000/media/assets/user-placeholder.jpg'}></img>
                </p>}
                {tenant.image && <p className="image is-100x100">
                  <img className='is-rounded' src={`http://localhost:4000${tenant.image}`}></img>
                </p>}
              </div>
            </div></Link>

          </div>
        })}
      </div>



      <div className="columns">
        <div className="column is-half">
          {user.residences[0] && <div className="box">

            <h2 className='centeredTitle'>CURRENT EXPENSES</h2>
            <Link to={'/expense/new'}><div className="box has-text-centered">
              <button className='button is-fullwidth is-link'>Add and new expense</button>
            </div></Link>

            {user.residences[0] && this.sortByDate(user.residences[0].expenses).map((expense, index) => {
              return <Link key={index} to={`/viewExpense/${expense.id}`}><div key={index} className="column is-12-desktop expenseRowDisplay">
                <p>{expense.company_name}</p>
                <p>{Moment(expense.expense_dated).format('Do MMMM YYYY')}</p>
                <p>£{expense.amount}</p>

              </div></Link>
            })}

          </div>}
        </div>
      </div>
    </div>
  }




}