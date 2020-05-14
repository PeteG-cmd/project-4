
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import { Link } from 'react-router-dom'

import Moment, { now } from 'moment'
import { LoadingDots } from './common/Spinner'

class ViewResidenceUser extends React.Component {

  constructor() {
    super()
    this.state = {
      viewUser: null,
      userProfile: null,
      currentUser: null

    }
  }

  componentDidMount() {
    this.setState({ viewUser: this.props.location.state })
    axios.post('/api/residence/user/', this.props.location.state, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.setState({ userProfile: res.data.user_profile, currentUser: res.data.current_user })
        console.log('hello')
        console.log(res.data)
      })
      .catch(err => this.setState({ error: err.response.data.message }))
  }

  handlePaid(split) {
    console.log(split)
    split.expense = split.expense.id
    split.user = split.user.id
    split.paid_flag = true
    split.admin_user = split.admin_user.id
    console.log(split)
    axios.put('/api/split/', split, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.setState({ userProfile: res.data.user_profile })
        console.log(res.data)
      })
      .catch(err => this.setState({ error: err.response.data.message }))
  }

  sortByDate(myData) {
    const newSplits = myData.map(data => {
      data.date = new Date(data.expense.expense_dated)
      return data
    })
    const sortedSplits = newSplits.sort((a, b) => b.date - a.date)
    return sortedSplits
  }

  handleRemove(user) {
    console.log(user)
    axios.put('/api/userprofile/', { 'user': user.id, 'residence': user.residences[0].id, 'moves': user.moves[0] }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => console.log(err))

  }


  render() {
    if (!this.state.viewUser || !this.state.userProfile) return <LoadingDots />
    console.log(this.state.userProfile)
    const user = this.state.userProfile
    const residence = user.residences[0]
    const moves = user.moves
    return <div>



      <div className="columns is multiline">
        <div className="column is-one-quarter ">
          <div className="box has-text-centered">
            <h1 className="title">Tenant information</h1>

            <div className='imageDiv150'>
              <figure className='image is-150x150'>
                <img src={`http://localhost:4000${user.image}`}></img>
              </figure>
            </div>
            <p>Name: {user.first_name} {user.second_name}</p>
            <p>User Name: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Current Residence: {residence.short_name}</p>
            <p>Moved in: {Moment(moves[0].moved_in).format('Do MMM YY')}</p>
            {moves[0].moved_out && <p>Moved out: {Moment(moves[0].moved_out).format('Do MMM YY')}</p>}

            <button className='button is-full-width is-danger' onClick={() => this.handleRemove(user)}>Leave Residence</button>

          </div>
        </div>


        <div className="column is-three-quarters">
          <div className="box has-text-centered">
            <h1 className="title">User Expenses</h1>
            <h1 className="subtitle breakHeading">Open Expenses</h1>
            <div className="splitSummaryRow mobileNone">
              <h5>Expense:</h5>
              <h5>Date:</h5>
              <h5>Total Amount:</h5>
              <h5>Amount owed:</h5>
              {user.id === this.state.currentUser.id && <h5>Mark as Paid</h5>}
            </div>

            {this.sortByDate(user.splits).map((split, index) => {
              return <div key={index} >
                {/* <div className="box has-tex-centered splitSummaryRow"> */}
                {split.paid_flag === false && <div className="level borderedLevel level-user">
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Expense:</h5>
                    <p>{split.expense.company_name}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Date:</h5>
                    <p>{Moment(split.expense.expense_dated).format('Do MMM YY')}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Total Amount:</h5>
                    <p>£{split.expense.amount.toLocaleString()}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Amount Owed:</h5>
                    <p>£{(split.percentage_to_pay).toLocaleString()}</p>
                  </div>
                  
                  {split.user.id === this.state.currentUser.id && <div className="level-item level-item-user has-text-centered">
                    <div>
                      {split.paid_flag === false && <button className="button is-success" onClick={(event) => this.handlePaid(split)}>Mark Paid</button>}
                      {split.paid_flag === true && <p>Paid</p>}
                    </div>
                  </div>}
                </div>}
              </div>

            })}

            <h1 className="subtitle breakHeading">Settled Expenses</h1>
            <div className="splitSummaryRow mobileNone">
              <h5>Expense:</h5>
              <h5>Date:</h5>
              <h5>Total Amount:</h5>
              <h5>Amount Paid:</h5>
            </div>

            {this.sortByDate(user.splits).map((split, index) => {
              return <div key={index} >
                {/* <div className="box has-tex-centered splitSummaryRow"> */}
                {split.paid_flag === true && <div className="level borderedLevel level-user">
                  <div className="level-item level-item-user">
                    <h5 className='mobileShow'>Expense:</h5>
                    <p>{split.expense.company_name}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Date:</h5>
                    <p>{Moment(split.expense.expense_dated).format('Do MMM YY')}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Total Amount:</h5>
                    <p>£{split.expense.amount.toLocaleString()}</p>
                  </div>
                  <div className="level-item level-item-user has-text-centered">
                    <h5 className='mobileShow'>Amount Paid:</h5>
                    <p>£{split.percentage_to_pay.toLocaleString()}</p>
                  </div>
                </div>}
              </div>
            })}
          </div>
        </div>
      </div >
    </div >






  }
}

export default ViewResidenceUser