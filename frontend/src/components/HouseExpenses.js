import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'moment'



const HouseExpenses = ({ user, groupedExpenses, expenseClicked }) => {

  return (
    <>

      <h2 className='centeredTitle'>CURRENT EXPENSES</h2>
      <Link to={'/expense/new'}><div className="box has-text-centered">
        <button className='button is-fullwidth is-link'>Add and new expense</button>
      </div></Link>

      {user.residences[0] && groupedExpenses.map((groupedExpense, index) => {
        return <div key={index} className='groupedExpense'>

          <div
            className="column is-12-desktop expenseRowDisplay expenseRowDisplayGrouped"
            name={`grouped-${index}`}
            onClick={() => expenseClicked(`${groupedExpense[0].company_name}`, `grouped-${index}`)}
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
    </>
  )

}

export default HouseExpenses