import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

import LoginForm from './common/forms/LoginForm'

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      data: {
        email: '',
        password: ''
      },
      error: ''
    }
  }

  handleChange(event) {
    const { name, value } = event.target
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/login', this.state.data)
      .then(res => {
        const token = res.data.token
        console.log(token)
        auth.setToken(token)
        this.props.history.push('/')
      })
      .catch(err => this.setState({ error: err.response.data.message }))

  }

  render() {
    return <main className="hero is-fullheight loginPage">
      <div className="hero-body">
        <div className="container">
          <section className="section">
            <div className="container has-text-centered">
              <div className="columns">
                <div className="column is-one-third"></div>
                <div className="column">
                  <div className="box">
                    <h1 className="title">Login</h1>
                   
                    <LoginForm
                      className="form"
                      handleSubmit={(event) => this.handleSubmit(event)}
                      handleChange={(event) => this.handleChange(event)}
                      error={this.state.error}
                      data={this.state.data}
                    />
                     
                  </div>
                </div>
                <div className="column"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  }
}

export default Login