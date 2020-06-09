
import React from 'react'



const ExpenseGroupingModal = ({ expense, groupClicked, cancelClicked }) => {

  if (!expense) return null
  return (
    <div className="modal" id='modal'>
      {console.log(expense)}
      <div className="modal-background" onClick={(event) => groupClicked(event)}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-centered">
          <p className="modal-card-title">This Expense Will Be Grouped:</p>
          <button className="delete" aria-label="close"></button>
        </header>
        <section className="modal-card-body has-text-centered">
          <p className='subtitle'>An expense with this name already exists.</p>
          <p> The details of the previous expense are:</p>
          <p>{expense.company_name}</p>
          <p>Expense Dated: {expense.expense_dated}</p>
          <div className='expense500Div'>
            <p className="image is-480x600">
              <img src={`${expense.image}`}></img>
            </p>
          </div>
          <p>If you do not wish to group these expenses, click cancel and select a new name for this expense.</p>

        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={(event) => groupClicked(event)}>Group this expense</button>
          <button className="button is-warning" onClick={(event) => cancelClicked(event)}>Do Not Group</button>
        </footer>
      </div>
    </div>
  )

}

export default ExpenseGroupingModal