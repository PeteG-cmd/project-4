import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

import RegistrationForm from './common/forms/RegistrationForm'

class Register extends React.Component {

  constructor() {
    super()
    this.state = {
      data: {
        email: '',
        first_name: '',
        second_name: '',
        password: '',
        password_confirmation: '',
        username: ''
      },
      errors: {}
    }
  }

  handleChange(event) {
    const { name, value } = event.target
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
    console.log(this.state.data)
  }

  // handleImageChange(image) {
  //   console.log(image)
  //   const form_data = new FormData()
  //   form_data.append('image', image.target.files[0], image.target.files[0].name)
  //   const data = { ...this.state.data, image: form_data }
  //   this.setState({ data })

  // }

  handleSubmit(event) {
    event.preventDefault()
    console.log(this.state.data)
    axios.post('/api/register', this.state.data)
      .then(res => {
        const token = res.data.token
        auth.setToken(token)
        this.props.history.push('/')
      })
      .catch(err => {
        console.log(err.response)
        this.setState({ errors: err.response.data })
      })
  }

  render() {
    const { errors } = this.state
    return <main className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <section className="section">
            <div className="container has-text-centered">
              <div className="columns">
                <div className="column is-one-third"></div>
                <div className="column is-one-third">
                  <div className="box">
                    <h1 className="title">Register</h1>
                    <RegistrationForm
                      handleSubmit={(event) => this.handleSubmit(event)}
                      handleChange={(event) => this.handleChange(event)}
                      // handleImageChange={(image) => this.handleImageChange(image)}
                      errors={errors}
                      data={this.state.data}
                    />
                  </div>
                </div>
                <div className="column is-one-third"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  }
}

export default Register