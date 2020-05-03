
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

  togglenav() {
    this.setState({ navMobileOpen: !this.state.navMobileOpen })
  }

  render() {
    const isLoggedIn = auth.isLoggedIn()
    return <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="media/assets/TitlesArtboard1.jpg" width="112" height="28" />
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
            <a onClick={() => this.togglenav()} className="navbar-link">
              Splits
            </a>
            <div className="navbar-dropdown">
              <div id="AllBooksNav"></div>
              <Link to="#" className="navbar-item" onClick={() => this.togglenav()}>
                <p>With my House</p>
              </Link>
              <Link to="#" className="navbar-item" onClick={() => this.togglenav()}>
                With another user
              </Link>
            </div>
          </div>}

          {isLoggedIn && <div
            className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" onClick={() => this.togglenav()}>
              Expenses
            </a>
            <div className="navbar-dropdown">
              <Link to="#" className="navbar-item" onClick={() => this.togglenav()}>
                My Expenses
              </Link>

              <Link to="#" className="navbar-item" onClick={() => this.togglenav()}>
                House Expenses
              </Link>

              <Link to="#" className="navbar-item" onClick={() => this.togglenav()}>
                Settled Expenses
              </Link>
            </div>
          </div>}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!isLoggedIn && <div className="button is-primary"><Link to="/register" onClick={() => this.togglenav()}><strong>Register</strong></Link></div>}
              {!isLoggedIn && <div className="button is-light" onClick={() => this.togglenav()}><Link to="/login">Log in</Link></div>}
              {isLoggedIn && <div className="button is-warning" onClick={() => this.togglenav()}><Link to="#">Profile</Link></div>}
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
