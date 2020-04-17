import React from 'react'

const LoginForm = ({ handleSubmit, handleChange, error, data }) => {
  const { email, password } = data

  return <form
    className="form"
    onSubmit={(event) => handleSubmit(event)}
  >
    <div className="field">
      <label className="label">
        Email
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="text"
          name="email"
          placeholder="Email..."
          className="input"
          vlaue={ email }
        />
        <span className="icon is-small is-left">
          <i className="fas fa-envelope"></i>
        </span>
      </div>
    </div>
    <div className="field">
      <label className="label">
        Password
      </label>
      <div className="control has-icons-left">
        <input
          onChange={(event) => handleChange(event)}
          type="password"
          name="password"
          className="input"
          placeholder="*******"
          vlaue={ password }
        />
        <span className="icon is-small is-left">
          <i className="fas fa-lock"></i>
        </span>
      </div>
      {error && <small className="help is-danger">
        {error}
      </small>}
    </div>
    <div>
      <button className="button is-success">Login</button>
    </div>
  </form>

}

export default LoginForm