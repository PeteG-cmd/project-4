
import React from 'react'
import axios from 'axios'

export default class Home extends React.Component {

  constructor() {
    super()

    this.state = {
      user: null
    }
  }



  render() {

    return <div className="columns">
      <div className="column is-one-third"></div>
      <div className="column">
        <div className="box">
          <h1 className="title">Home</h1>

         
        </div>
      </div>
      <div className="column"></div>
    </div>

  }




}