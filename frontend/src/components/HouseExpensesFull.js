import React, { useState, useEffect } from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import { Link } from 'react-router-dom'

import Moment, { now } from 'moment'
import Spinner, { LoadingDots } from './common/Spinner'

import HouseExpenses from './HouseExpenses'

const HouseExpensesFull = () => {

  const [user, setUser] = useState([])
  let groupedExpenses = null

  useEffect(() => {
    axios.get('/api/userprofile/', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        setUser(res.data)
        console.log(res.data)
        return groupedExpenses = groupExpenses(res.data)
      })
      .then(res => console.log(groupedExpenses))
  }, [])

  function sortByDate(splits) {
    const newSplits = splits.map(split => {
      split.expense_dated = new Date(split.expense_dated)
      return split
    })
    const sortedSplits = newSplits.sort((a, b) => b.expense_dated - a.expense_dated)
    return sortedSplits
  }

  function groupExpenses(user1) {
    // if (!user.residences[0]) return
    const groupedExpenses = {}
    sortByDate(user1.residences[0].expenses).map(expense => {
      if (!groupedExpenses[expense.company_name]) {
        groupedExpenses[expense.company_name] = [expense]
      } else {
        groupedExpenses[expense.company_name].push(expense)
      }
    })
    const array = Object.values(groupedExpenses)
    return array

  }

  function expenseClicked(name, group) {
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


  // if (user) return  <HouseExpenses user={user} groupedExpenses={groupedExpenses} expenseClicked={expenseClicked} /> 


  return (
    <>
    {user.id && groupedExpenses && <HouseExpenses user={user} groupedExpenses={groupedExpenses} expenseClicked={expenseClicked} />}
      
    </>
  )


}

export default HouseExpensesFull