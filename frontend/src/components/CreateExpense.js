
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import DatePicker from 'react-date-picker'
import Moment, { now } from 'moment'

import ExpenseGroupingModal from './ExpenseGroupingModal'
import { LoadingDots } from './common/Spinner'


class CreateExpense extends React.Component {

  constructor() {
    super()
    this.state = {
      company_name: '',
      description: '',
      expense_dated: new Date(),
      date_from: null,
      formatDateFrom: null,
      date_to: null,
      formatDateTo: null,
      amount: 0,
      payment_due_date: null,
      formatPaymentDueDate: null,
      image: null,
      residence: null,
      userProfile: null,
      splits: [],
      mySplits: {},
      errors: {},
      expense: null
    }
  }

  componentDidMount() {
    axios.get('/api/userprofile/', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res)
        this.setState({ userProfile: res.data, residence: res.data.residences[0].id })
        setTimeout(() => {
          const splits = this.state.splits
          this.state.userProfile.residences[0].tenants.map((tenant, index) => {
            const split = { 'user': tenant.id, 'percentage_to_pay': 0, 'paid_flag': 'False' }
            splits[index] = split
            this.setState({ splits })
            const today = Moment(new Date()).format('YYYY-MM-DD')
            this.setState({ expense_dated: today })
          })
        }, 50)
      })
      .catch(err => this.setState({ errors: err.response.data }))
  }

  handleSubmit() {
    event.preventDefault()
    let totalSplit = 0
    this.state.splits.map(split => {
      if (split.percentage_to_pay === '') {
        split.percentage_to_pay = 0
      }
      totalSplit += parseFloat(split.percentage_to_pay)
    })
    console.log(totalSplit)
    console.log(this.state.amount)
    if (!(parseFloat(totalSplit.toFixed(2)) === parseFloat(this.state.amount))) return this.setState({ errors: { 'split': [`The total of all the splits must equal the value of the expense. Currently there is a difference of £${(parseFloat(totalSplit) - parseFloat(this.state.amount)).toFixed(2)}`] } })
    if (parseFloat(this.state.amount) === 0) return this.setState({ errors: { 'amount': [`The amount must be at least £${0.01 * this.state.userProfile.residences[0].tenants.length}`] } })

    axios.post('/api/expense/', this.state, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res)
        this.props.history.push(`/addBillImage/${res.data.Expense.id}`)
      })
      .catch(err => this.setState({ errors: err.response.data }))
    // 'Content-Type': 'multipart/form-data',
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
    console.log(this.state)
    if (name === 'amount') {
      this.handleSplit(value)
    }
  }

  handleSplitChange(tenant, event) {
    const { name, value } = event.target
    const split = { 'user': tenant.id, 'percentage_to_pay': value, 'paid_flag': 'False' }
    const splits = this.state.splits
    splits[name] = split
    this.setState({ splits })
    console.log(this.state)
  }

  handleSplit(value) {
    let evenSplit = value / this.state.userProfile.residences[0].tenants.length
    evenSplit = Math.round(evenSplit * 100) / 100
    console.log(evenSplit)

    console.log(value)
    let correction = parseFloat(value) - (parseFloat(evenSplit.toFixed(2)) * this.state.userProfile.residences[0].tenants.length)
    correction = Math.round(correction * 100) / 100

    console.log(correction)
    const splits = this.state.splits.map(split => {
      split.percentage_to_pay = parseFloat(evenSplit.toFixed(2))
      if (split.user === this.state.userProfile.id) {
        split.percentage_to_pay = parseFloat(split.percentage_to_pay.toFixed(2)) + (parseFloat(correction.toFixed(2)))
        split.percentage_to_pay = split.percentage_to_pay.toFixed(2)
      }
      return split
    })
    this.setState({ splits })
  }

  handleImageChange(image) {
    const formData = new FormData()
    formData.append('image', image.target.files[0], image.target.files[0].name)
    this.setState({ image: formData })
  }

  handleDateChange(name, value) {
    console.log(value)
    const x = document.getElementsByClassName('datebutton')
    if (value === null && (name === 'date_to' || name === 'date_from')) {
      this.setState({ formatDateFrom: null, formatDateTo: null, date_to: null, date_from: null })
      for (let i = 0; i < x.length; i++) {
        x[i].disabled = true
      }
      return
    }
    if (value === null && name === 'payment_due_date') {
      this.setState({ formatPaymentDueDate: null, payment_due_date: null })
      return
    }
    const data = Moment(value).format('YYYY-MM-DD')
    const newData = new Date(data)
    this.setState({ [name]: data })
    if (name === 'date_from') {
      this.setState({ formatDateFrom: newData })
    } else if (name === 'date_to') {
      this.setState({ formatDateTo: newData })
    } else if (name === 'payment_due_date') {
      this.setState({ formatPaymentDueDate: newData })
    }
    setTimeout(() => {
      if (this.state.date_from !== null && this.state.date_to !== null) {
        for (let i = 0; i < x.length; i++) {
          x[i].disabled = false
        }
      }
    }, 100)
  }

  customClicked(event) {
    event.preventDefault()
    const x = document.getElementsByClassName('splitField')
    for (let i = 0; i < x.length; i++) {
      x[i].disabled = false
    }

  }

  evenlyClicked(event) {
    event.preventDefault()
    const x = document.getElementsByClassName('splitField')
    for (let i = 0; i < x.length; i++) {
      x[i].disabled = true
    }
    this.handleSplit(this.state.amount)
  }

  byDateClicked() {
    event.preventDefault(event)
    const expenseLengthDays = Moment([this.state.formatDateTo]).diff(Moment([this.state.formatDateFrom]), 'days')
    console.log(expenseLengthDays)
    // this.state.userProfile.residences[0].moves.map(move => {
    //   moved_in = Moment(move.moved_in)
    // })
  }

  toggleModal() {
    document.getElementById('modal').classList.toggle('is-active')
  }

  expenseNameGrouping(event) {
    const { name, value } = event.target
    this.state.userProfile.residences[0].expenses.some(expense => {
      if (expense.company_name === value) {
        this.setState({ expense })
        setTimeout(() => {
          this.toggleModal()
        }, 100)
      }
    })
  }

  groupClicked() {
    this.toggleModal()
  }

  cancelClicked() {
    this.toggleModal()
    this.setState({ company_name: this.state.company_name + ' - ' + Date.now() })
    console.log(this.state)

  }

  

  render() {
    const errors = this.state.errors
    if (!this.state.userProfile || this.state.splits.length < this.state.userProfile.residences[0].tenants.length) return <LoadingDots />
    return <div>
      <ExpenseGroupingModal expense={this.state.expense} groupClicked={(event) => this.groupClicked(event)} cancelClicked={(event) => this.cancelClicked(event) }/>
      <form className='form' onSubmit={(event) => this.handleSubmit(event)}>
        <div className="box has-text-centered">
          <div className="columns is-multiline">
            <div className="column is-two-thirds">
              <div className="box has-text-centered growHeight">
                <h1 className="title">Add a new expense</h1>


                <div className="field">
                  <label className="label">
                    Expense Name:
                  </label>
                  <input
                    onChange={(event) => this.handleChange(event)}
                    onBlur={(event) => this.expenseNameGrouping(event)}
                    type="text"
                    name="company_name"
                    placeholder="Enter Company Name..."
                    className="input"
                    value={this.state.company_name}
                  />
                  {errors.company_name && <small className="help is-danger">
                    {errors.company_name[0]}
                  </small>}
                </div>

                <div className="field">
                  <label className="label">
                    Description:
                  </label>
                  <input
                    onChange={(event) => this.handleChange(event)}
                    type="text"
                    name="description"
                    placeholder="Enter a short description of the expense..."
                    className="input"
                    value={this.state.description}
                  />
                  {errors.description && <small className="help is-danger">
                    {errors.description[0]}
                  </small>}
                </div>

                <div className="level">
                  <div className="level-item has-text-centered">

                    <div className="field">
                      <label className="label">
                        Expense Dated:
                      </label>

                      <DatePicker
                        clearIcon={null}
                        onChange={(value) => this.handleDateChange('expense_dated', value)}
                        value={new Date(this.state.expense_dated)}
                      />
                      {errors.expense_dated && <small className="help is-danger">
                        {errors.expense_dated[0]}
                      </small>}
                    </div>
                  </div>

                  <div className="level-item has-text-centered">


                    <div className="field">
                      <label className="label">
                        Date From:
                      </label>
                      <DatePicker
                        onChange={(value) => this.handleDateChange('date_from', value)}
                        value={this.state.formatDateFrom}
                      />
                      {errors.date_from && <small className="help is-danger">
                        {errors.date_from[0]}
                      </small>}
                    </div>
                  </div>

                  <div className="level-item has-text-centered">


                    <div className="field">
                      <label className="label">
                        Date To:
                      </label>
                      <DatePicker
                        onChange={(value) => this.handleDateChange('date_to', value)}
                        value={this.state.formatDateTo}
                      />
                      {errors.date_to && <small className="help is-danger">
                        {errors.date_to[0]}
                      </small>}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">
                    Amount (£):
                  </label>
                  <input
                    onChange={(event) => this.handleChange(event)}
                    type="number"
                    step='0.01'
                    name="amount"
                    placeholder="Amount..."
                    className="input"
                    value={this.state.amount}
                  />
                  {errors.amount && <small className="help is-danger">
                    {errors.amount[0]}
                  </small>}
                </div>

                <div className="field">
                  <label className="label">
                    Payment Due Date:
                  </label>
                  <DatePicker
                    onChange={(value) => this.handleDateChange('payment_due_date', value)}
                    value={this.state.formatPaymentDueDate}
                  />
                  {errors.payment_due_date && <small className="help is-danger">
                    {errors.payment_due_date[0]}
                  </small>}
                </div>




                {/* <div className="field">
                  <label className="label">
                    Upload Image:
                  </label>
                  <input type="file"
                    id="image"
                    name='image'
                    accept="image/png, image/jpeg"
                    onChange={(image) => this.handleImageChange(image)}
                  />
                  {errors.image && <small className="help is-danger">
                    {errors.image[0]}
                  </small>}
                </div> */}
              </div>
            </div>

            <div className="column is-one-third">
              <div className="box has-text-centered growHeight">
                <h1 className="title">How shoult this expense be split?</h1>

                <button className='button' onClick={(event) => this.evenlyClicked(event)}>Evenly</button>
                <button className='button' onClick={(event) => this.customClicked(event)}>Custom</button>
                <button
                  disabled
                  className='button tooltip datebutton'
                  onClick={(event) => this.byDateClicked(event)}>
                  By Date<span className="tooltiptext">To Split this by date, you must enter the 'date from' and 'date to' for the related expense</span></button>



                {this.state.userProfile.residences[0].tenants.map((tenant, index) => {

                  return <div key={index} className="field">
                    <label className="label">
                      {tenant.username}
                    </label>
                    <input
                      disabled
                      onChange={(event) => this.handleSplitChange(tenant, event)}
                      id='splitFields'
                      type="number"
                      step='0.01'
                      name={index}
                      placeholder={`Owed by ${tenant.username}`}
                      className="input splitField"
                      value={this.state.splits[index].percentage_to_pay}
                    />
                  </div>

                })}
                {errors.split && <small className="help is-danger">
                  {errors.split[0]}
                </small>}
              </div>


            </div>
            <div className="box has-tex-centered growWidth">
              <div>
                <button className="button is-success">Add Expense</button>
              </div>
            </div>



          </div>

        </div>
      </form>
    </div>
  }

}

export default CreateExpense
