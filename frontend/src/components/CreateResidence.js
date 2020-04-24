
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

class CreateResidence extends React.Component {
  constructor() {
    super()

    this.state = {
      data: {
        short_name: null
      }
    }
  }

  handleSubmit() {
    event.preventDefault()
    axios.post('/api/residence/', this.state.data, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => console.log(err))

  }

  handlePatch() {
    event.preventDefault()
    axios.put('/api/residence/', this.state.data, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => console.log(err))

  }

  handleChange(event) {
    const { name, value } = event.target
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
    console.log(this.state.data)
  }

  render() {
    return <div>

      <div className="columns is-multiline is-mobile">
        <div className="column is-12">
          <div className="box has-text-centered">
            <h1 className="title">Create House Account</h1>
            <form className='form' onSubmit={(event) => this.handleSubmit(event)}>

              <div className="field">
                <label className="label">
                  House Name:
                </label>
                <div className="control has-icons-left">
                  <input
                    onChange={(event) => this.handleChange(event)}
                    type="text"
                    name="short_name"
                    placeholder="Enter House Name..."
                    className="input"
                    value={this.state.short_name}
                  />
                </div>
              </div>

              <div>
                <button className="button is-success">Create House</button>
              </div>
            </form>

          </div>
        </div>

        <div className="column is-12">
          <div className="box has-text-centered">
            <h1 className="title">Join House Account</h1>
            <form className='form' onSubmit={(event) => this.handlePatch(event)}>

              <div className="field">
                <label className="label">
                  What is the name of the group you want to join?
                </label>
                <div className="control has-icons-left">
                  <input
                    onChange={(event) => this.handleChange(event)}
                    type="text"
                    name="short_name"
                    placeholder="Enter House Name..."
                    className="input"
                    value={this.state.short_name}
                  />
                </div>
              </div>

              <div>
                <button className="button is-success">Join House</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div >
  }



}

export default CreateResidence