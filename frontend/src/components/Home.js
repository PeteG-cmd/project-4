
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

  groupExpenses() {
    if (!this.state.userProfile.residences[0]) return
    const groupedExpenses = {}
    this.sortByDate(this.state.userProfile.residences[0].expenses).map(expense => {
      if (!groupedExpenses[expense.company_name]) {
        groupedExpenses[expense.company_name] = [expense]
      } else {
        groupedExpenses[expense.company_name].push(expense)
      }
    })
    const array = Object.values(groupedExpenses)
    return array

  }

  expenseClicked(name, group) {
    console.log(group)
    // event.preventDefault()
    const x = document.getElementsByName(name)
    for (let i = 0; i < x.length; i++) {
      x[i].classList.toggle('hiddenTab')
      x[i].classList.toggle('slideDown')
    }
    const y = document.getElementsByName(group)
    for (let i = 0; i < y.length; i++) {
      y[i].classList.toggle('closeCross')
    }
  }

  amountDueInDays(user, tenant, lessThanDays, greaterThanDays) {
    let amount = 0
    user.residences[0].expenses.map(expense => {
      const daysUntilDue = (Moment(expense.payment_due_date).diff(Moment(new Date()), 'days'))
      if (daysUntilDue > greaterThanDays && daysUntilDue < lessThanDays) {
        expense.splits.map(split => {
          if (split.user.id === tenant.id && split.paid_flag === false) {
            amount += split.percentage_to_pay
          }
        })
      }
    })
    return amount
  }

  


  render() {

    if (!this.state.userProfile) return <h1>Waiting</h1>
    const user = this.state.userProfile
    const dashData = this.calculateDashboard()
    const groupedExpenses = this.groupExpenses()
    console.log(groupedExpenses)
    console.log(typeof (groupedExpenses))

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
                  <img className='is-rounded' src={'media/assets/round-logo-1.jpg'}></img>
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
                    {user.image && <img className='is-rounded' src={`${user.image}`}></img>}

                    {!user.image && <img className='is-rounded' src={'media/assets/user-placeholder.jpg'}></img>}

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
                  <img className='is-rounded' src={'media/assets/user-placeholder.jpg'}></img>
                </p>}
                {tenant.image && <p className="image is-100x100">
                  <img className='is-rounded' src={`${tenant.image}`}></img>
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

            {user.residences[0] && groupedExpenses.map((groupedExpense, index) => {
              return <div key={index} className='groupedExpense'>

                <div
                  className="column is-12-desktop expenseRowDisplay expenseRowDisplayGrouped"
                  name={`grouped-${index}`}
                  onClick={() => this.expenseClicked(`${groupedExpense[0].company_name}`, `grouped-${index}`)}
                >
                  <p>{groupedExpense[0].company_name}</p>
                  <p>Bills Grouped: {groupedExpense.length}</p>
                  <p>Latest Bill: {Moment(groupedExpense[0].expense_dated).format('DD MM YY')}</p>
                </div>
                {groupedExpense.map((expense, index) => {
                  return <Link key={index} to={`/viewExpense/${expense.id}`}>
                    <div
                      className="column is-12-desktop expenseRowDisplay hiddenTab"
                      name={expense.company_name}
                    >
                      <p>{expense.company_name}</p>
                      <p>{Moment(expense.expense_dated).format('Do MMMM YYYY')}</p>
                      <p>£{expense.amount}</p>
                    </div></Link>

                })}

              </div>

            })}

          </div>}
        </div>


        <div className="column is-half">
          <div className="box has-text-centered">
            <h2 className='centeredTitle'>HOUSE TIMELINE</h2>
            {user.residences[0] && <div className="columns is-multiline is-mobile">
              {user.residences[0].tenants.map((tenant, index) => {
                return <div key={index} className='column is-one-quarter-desktop is-one-third-tablet is-half-mobile'>
                  <div className="circleBox">
                    <p className="image is-100x100">
                      {tenant.image && <img className='is-rounded' src={`${tenant.image}`}></img>}
                      {!tenant.image && <img className='is-rounded' src={'media/assets/user-placeholder.jpg'}></img>}
                    </p>
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Overdue:</p>
                    <p>£{(this.amountDueInDays(user, tenant, 0, -100000)).toLocaleString('en')}</p>
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Due in next 7 days:</p>
                    <p>£{(this.amountDueInDays(user, tenant, 8, -1)).toLocaleString('en')}</p>
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Due in next 7 - 31 Days:</p>
                    <p>£{(this.amountDueInDays(user, tenant, 32, 7)).toLocaleString('en')}</p>
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Due in: 31 days +:</p>
                    <p>£{(this.amountDueInDays(user, tenant, 1000000, 31)).toLocaleString('en')}</p>
                  </div>
                </div>
              })}

            </div>}
          </div>
        </div>
      </div>
    </div>
  }




}