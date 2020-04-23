
import React from 'react'
import { Link } from 'react-router-dom'
import auth from '../../lib/auth'
import { withRouter } from 'react-router-dom'

class Navbar extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  handleLogout() {
    auth.logout()
    this.props.history.push('/HouseShareWelcome')
  }

  render() {
    const isLoggedIn = auth.isLoggedIn()
    return <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="http://localhost:4000/media/assets/TitlesArtboard1.jpg" width="112" height="28" />
        </a>
        

        <a role="button"
          className={`navbar-burger burger ${this.state.navMobileOpen ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => this.setState({ navMobileOpen: !this.state.navMobileOpen })}
          data-target="navbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>


      <div className={`navbar-menu ${this.state.navMobileOpen ? 'is-active' : ''}`}>
        <div className="navbar-start">
          {/* <Link className="navbar-item" to="/">Home</Link> */}

          {isLoggedIn && <div
            className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              Splits
            </a>
            <div className="navbar-dropdown">
              <div id="AllBooksNav"></div>
              <Link to="#" className="navbar-item">
                <p id="AllBooksNav">With my House</p>
              </Link>
              <Link to="#" className="navbar-item">
                With another user
              </Link>
            </div>
          </div>}

          {isLoggedIn && <div
            className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              Expenses
            </a>
            <div className="navbar-dropdown">
              <Link to="/bookclubs/myBookClubs" className="navbar-item">
                My Expenses
              </Link>

              <Link to="/bookclubs/new" className="navbar-item">
                House Expenses
              </Link>

              <Link to="/bookclubs" className="navbar-item">
                Settled Expenses
              </Link>
            </div>
          </div>}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!isLoggedIn && <div className="button is-primary"><Link to="/register"><strong>Register</strong></Link></div>}
              {!isLoggedIn && <div className="button is-light"><Link to="/login">Log in</Link></div>}
              {isLoggedIn && <div className="button is-warning"><Link to="#">Profile</Link></div>}
              {isLoggedIn && <div
                onClick={() => this.handleLogout()}
                className="button is-light"
              >
                Logout
              </div>}
            </div>
          </div>
        </div>

      </div>
    </nav>
  }
}
export default withRouter(Navbar)
