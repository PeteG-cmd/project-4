import React from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

export const Spinner = () => {

  return <div className='Loading'>
    <Loader
      type='TailSpin'
      color='#00BFFF'
      className='Loading'
      height={100}
      width={100}
      timeout={10000}
    />
  </div>
}

export const LoadingDots = () => {

  return <div className='Loading'>
    <Loader
      type='ThreeDots'
      color='#383534'
      className='Loading'
      height={30}
      width={60}
      timeout={10000}
    />


  </div>

}