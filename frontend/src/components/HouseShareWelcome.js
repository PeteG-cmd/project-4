
import React from 'react'
import { Link } from 'react-router-dom'

const HouseShareWelcome = () => {

  return <div className='welcomePageDiv growWidth'>

    <img className='welcomePageImage' src="media/assets/round-logo-2.jpg" alt=""/>

    <h1 className='welcomePageText topBorder'>Welcome to House-Share!</h1>
    <h2 className='welcomePageText'>This is the app to make your life easier.</h2>

    {/* <h2 className='welcomePageText'> On House-Share you can:</h2>
    <p>Share Expenses</p> */}

    <div className="level">
      <div className="level-item homeButtons">
        <Link to={'/register'}><button className='button is-link welcomPageButton'>Sign Up Now</button></Link>
        <Link to={'/login'}><button className='button is-link'>Login</button></Link>
      </div>
    </div>

    {/* <img className='welcomePageImage' src="media/assets/money-image.jpg" alt=""/> */}

   
  </div>

}

export default HouseShareWelcome

