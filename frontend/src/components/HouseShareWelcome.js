
import React from 'react'
import { Link } from 'react-router-dom'

const HouseShareWelcome = () => {

  return <div className='welcomePageDiv growWidth'>

    <img className='welcomePageImage' src="http://localhost:4000/media/assets/round-logo-2.jpg" alt=""/>

    <div className="level">
      <div className="level-item">
        <Link to={'/register'}><button className='button is-link welcomPageButton'>Sign Up Now</button></Link>
        <Link to={'/login'}><button className='button is-link'>Login</button></Link>
      </div>
    </div>


    <h1 className='welcomePageText'>Welcome to House-Share!</h1>
    <h2 className='welcomePageText'>This is the app to make your life easierHELOOOOOOOO.</h2>

    <h2 className='welcomePageText'> On House-Share you can:</h2>
    <p>Share Expenses</p>

    <img className='welcomePageImage' src="http://localhost:4000/media/assets/money-image.jpg" alt=""/>

   
  </div>

}

export default HouseShareWelcome

