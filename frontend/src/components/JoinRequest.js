
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

class JoinRequest extends React.Component {

  constructor() {
    super()
    this.state = {
      join_requests: null,
      residenceId: null

    }
  }

  componentDidMount() {
    this.setState({ join_requests: this.props.join_requests, residenceId: this.props.residenceId })
  }

  handleRequest(userId, event) {

    axios.put('/api/residence/users/', { user_id: userId, event: event.target.value, residence_id: this.state.residenceId }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.props.handleUpdate(event)
        this.setState({ join_requests: res.data.join_requests })
      })

  }

  render() {
    if (!this.state.join_requests) return <h1>Waiting</h1>

    const join_requests = this.state.join_requests
    return <>
      {join_requests.map((request, index) => {
        return <div key={index}>
          <p>{request.first_name} {request.second_name}</p>
          <figure className='image is-24x24'>
            <img src={`http://localhost:4000${request.image}`}></img>
          </figure>
          <button className='button is-small is-rounded is-success' value='accept' onClick={(event) => this.handleRequest(request.id, event)}>Accept</button>
          <button className='button is-small is-rounded is-danger' value='decline' onClick={(event) => this.handleRequest(request.id, event)}>Decline</button>


        </div>
      })}
    </>
  }
}

export default JoinRequest

