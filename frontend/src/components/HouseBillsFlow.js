
import React from 'react'


const HouseBillsFlow = ({ user, amountDueInDays }) => {

  
  return (
    
    <>
    {console.log(user)}
      <h2 className='centeredTitle'>HOUSE TIMELINE</h2>
      {user.residences[0] && <div className="columns is-multiline is-mobile">
        {user.residences[0].tenants.map((tenant, index) => {
          return <div key={index} className='column is-one-quarter-desktop is-one-third-tablet is-half-mobile'>
            <div className="circleBox">
              <p className="image is-100x100">
                {tenant.image && <img className='is-rounded' src={`http://localhost:4000${tenant.image}`}></img>}
                {!tenant.image && <img className='is-rounded' src={'http://localhost:4000/media/assets/user-placeholder.jpg'}></img>}
              </p>
            </div>
            <div className="lineBox"></div>
            <div className="rectBox">
              <p>Overdue:</p>
              <p>£{(amountDueInDays(user, tenant, 0, -100000)).toLocaleString('en')}</p>
            </div>
            <div className="lineBox"></div>
            <div className="rectBox">
              <p>Due in next 7 days:</p>
              <p>£{(amountDueInDays(user, tenant, 8, -1)).toLocaleString('en')}</p>
            </div>
            <div className="lineBox"></div>
            <div className="rectBox">
              <p>Due in next 7 - 31 Days:</p>
              <p>£{(amountDueInDays(user, tenant, 32, 7)).toLocaleString('en')}</p>
            </div>
            <div className="lineBox"></div>
            <div className="rectBox">
              <p>Due in: 31 days +:</p>
              <p>£{(amountDueInDays(user, tenant, 1000000, 31)).toLocaleString('en')}</p>
            </div>
          </div>
        })}

      </div>}
    </>
  )

}

export default HouseBillsFlow