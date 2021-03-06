
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import auth from '../lib/auth'

import Moment, { now } from 'moment'
import { LoadingDots } from './common/Spinner'

class ViewExpense extends React.Component {

  constructor() {
    super()
    this.state = {
      expense: null
    }
  }

  // const [expense, setExpense] = useState([])

  componentDidMount() {
    const expenseId = this.props.match.params.expense_id
    axios.get(`/api/expense/${expenseId}/`, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res)
        this.setState({ expense: res.data })
      })
  }

  calculateAmountPaid() {
    let amountPaid = 0
    this.state.expense.splits.map(split => {
      if (split.paid_flag === true) {
        amountPaid += split.percentage_to_pay
      }
    })
    return amountPaid.toLocaleString()
  }


  render() {
    console.log(this.state.expense)
    if (!this.state.expense) return <LoadingDots />
    const expense = this.state.expense

    return <div>

      <div className="columns is multiline">
        <div className="column is-half ">
          <div className="box has-text-centered">
            <h1 className="title">Expense Detail</h1>

            {/* <p>Expense:</p> */}
            <h1 className='subtitle'> {expense.company_name}</h1>

            {/* <p>Description:</p> */}
            <p className='subtitle'>{expense.description}</p>

            <div className="box">
              <p>Expense Dated:{Moment(expense.expense_dated).format('Mo MMMM YYYY')}</p>


              {expense.date_to && expense.date_from && <div className="level">
                <div className="level-item">
                  <div className="rectBox">
                    <p>Period Start:</p>
                    {expense.date_from && <p>{Moment(expense.date_from).format('DD/MM/YYYY')}</p>}
                  </div>


                  <div className="rectLineBoxTop">
                    {expense.date_from && expense.date_to && <p>Period Length: {Moment(expense.date_to).diff(Moment(expense.date_from), 'days')} Days</p>}
                  </div>


                  <div className="rectBox">
                    <p>Period End:</p>
                    {expense.date_from && <p>{Moment(expense.date_to).format('DD/MM/YYYY')}</p>}
                  </div>

                </div>
              </div>}
            </div>
            <div className="box">
              <p className='subtitle'>£{expense.amount.toLocaleString()}</p>
              {expense.payment_due_date && <p className='subtitle'>Expense Due:{Moment(expense.payment_due_date).format('Mo MMMM YYYY')}</p>}
            </div>
            <div className='box'>
              <p className='subtitle'>This expense costs:</p>
              {expense.date_to && expense.date_from && <p>Per Day: £{(expense.amount / Moment(expense.date_to).diff(Moment(expense.date_from), 'days')).toLocaleString()}</p>}
              <p>Per User: £{(expense.amount / expense.splits.length).toLocaleString()}</p>
              {expense.date_to && expense.date_from && <p>Per User per Day: £{((expense.amount / Moment(expense.date_to).diff(Moment(expense.date_from), 'days')) / expense.splits.length).toLocaleString()} </p>}
            </div>

            <br></br>

            <div className='userNameImageBar'>
              <p>Expense added by: {expense.admin_user.username}</p>
              <div className='imageDiv50'>
                <figure className='image is-32x32'>
                  <img src={`${expense.admin_user.image}`}></img>
                </figure>
              </div>
            </div>

            <br></br>


            <p className="image is-480x600">
              <img src={`${expense.image}`}></img>
            </p>
          </div>

        </div>


        <div className="column is-half">
          <div className="box has-text-centered growHeight">
            <h1 className="title">Payment Status</h1>
            <div className="box">
              <p className='subtitle'>Total Expense Amount: £{expense.amount.toLocaleString()}</p>
            </div>

            <div className="box">
              <p className='subtitle'>Total Paid: £{this.calculateAmountPaid()}</p>
            </div>

            <div className="box">
              <p className='subtitle'>Total Outstanding: £{(expense.amount - this.calculateAmountPaid()).toLocaleString()}</p>
            </div>

            {expense.payment_due_date && <div className="box">
              <p className='subtitle'>The outstanding amount is due in {Moment(expense.payment_due_date).diff(Moment(new Date()), 'days')} days</p>
            </div>}

            <div className="columns is-multiline is-mobile">
              {expense.splits.map((split, index) => {
                return <div key={index} className='column is-one-quarter-desktop is-one-third-tablet is-half-mobile'>
                  <div className="circleBox">
                    <p className="image is-100x100">
                      {split.user.image && <img className='is-rounded' src={`${split.user.image}`}></img>}
                      {!split.user.image && <img className='is-rounded' src={'/media/assets/user-placeholder.jpg'}></img>}
                    </p>
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Amount Owed</p>
                    {split.paid_flag === false && <p>£{split.percentage_to_pay.toLocaleString()}</p>}
                    {split.paid_flag === true && <p>£0</p>}
                  </div>
                  <div className="lineBox"></div>
                  <div className="rectBox">
                    <p>Amount Paid</p>
                    {split.paid_flag === true && <p>£{split.percentage_to_pay.toLocaleString()}</p>}
                    {split.paid_flag === false && <p>£0</p>}
                  </div>
                </div>
              })}
            </div>






          </div>
        </div>
      </div >
    </div >



  }




}

export default ViewExpense