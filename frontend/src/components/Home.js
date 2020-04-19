
import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'
import { Link } from 'react-router-dom'


export default class Home extends React.Component {

  constructor() {
    super()

    this.state = {
      userProfile: null
    }
  }

  componentDidMount() {
    axios.get('/api/userprofile', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        this.setState({ userProfile: res.data })
      })
      .catch(err => this.setState({ error: err.response.data.message }))
  }


  render() {
    const user = this.state.userProfile

    if (!this.state.userProfile) return <h1>WAITING FOR USER</h1>

    console.log(this.state.userProfile)

    return <div>

      <div className="columns">
        {/* <div className="column"></div> */}
        <div className="column">
          <div className="box has-text-centered">
            <h1 className="title">Home</h1>
            <div className='circleBox'>
              {!user.residences[0] && !user.new_residence[0] && <p><Link to={'/createResidence'}>Click to Add/Join House</Link></p>}
              {user.residences[0] && <p>NAME AND PICTURE OF HOUSE, CLICKABLE TO SEE SOME ADMIN USER?</p>}
              {user.new_residence[0] && <p>Awaiting approval from Admin</p>}
            </div>
            <div className="lineBox"></div>
            <div className='circleBox'>
              {!user.image && <p><Link to={'/addProfileImage'}>Click to add profile image</Link></p>}
              {user.image && <p className="image is-64x64">
                <img src={`http://localhost:4000${user.image}`}></img>
              </p>}
            </div>
          </div>
        </div>
        {/* <div className="column is-one-third"></div> */}
      </div>


      <div className="columns is-multiline is-mobile">
        {user.residences[0] && user.residences[0].tenants.map((tenant, index) => {
          return <div key={index} className="column is-3-desktop is-4-tablet is-half-mobile has-text-centered">
            <div className="box">
              <p>{tenant.username}</p>
              <div className='circleBox'>
                {!tenant.image && <p><Link to={'/'}>No image</Link></p>}
                {tenant.image && <p className="image is-64x64">
                  <img src={`http://localhost:4000${tenant.image}`}></img>
                </p>}
              </div>
            </div>

          </div>
        })}
      </div>

      <h2 className='centeredTitle'>CURRENT EXPENSES</h2>
      <div className="columns is-multiline is-mobile">
        {user.residences[0] && user.residences[0].expenses.map((expense, index) => {
          return <div key={index} className="column is-12-desktop">
            <div className="box">
              <p>{expense.company_name}</p>
              {/* <div className='circleBox'>
                {!tenant.image && <p><Link to={'/'}>No image</Link></p>}
                {tenant.image && <p className="image is-64x64">
                  <img src={`http://localhost:4000${tenant.image}`}></img>
                </p>}
              </div> */}
            </div>

          </div>
        })}
      </div>



    </div>
  }




}